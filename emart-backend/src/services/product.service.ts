import { PrismaClient, Prisma } from "@prisma/client";
import {
  ProductCreatePayload,
  ProductDeleteQuery,
  ProductDeleteResponse,
  ProductQueryResponse,
  ProductResponse,
} from "../models/product.model";
import ExcelJS from "exceljs";
import { productDeleteMapper, productMapper } from "../mappers/product.mapper";
import HttpException from "../models/http-exception.model";
import { imageUploadToFirebase } from "../utils/firebaseUpload";
import { updateCategoriesProducts } from "../utils/update.utils.";
import { bucket } from "../firebase";
const prisma = new PrismaClient();

// create Product
export const createProduct = async (
  input: ProductCreatePayload,
  imageList: Express.Multer.File[],
  userId: number,
  userRole: string
): Promise<ProductResponse> => {
  if (userRole === "admin" || userRole == "staff") {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } },
    });
    if (checkUser?.manager?.roles.title !== "super admin")
      throw new HttpException(401, "Unauthorized access");
  }

  const {
    name,
    description,
    quantity,
    categoryId,
    price,
    code,
    tags,
    piece,
    bora,
    carton,
    kg,
  } = input;

  if (!name) throw new HttpException(400, "Product name can't be blank");
  if (!description) throw new HttpException(400, "Description can't be blank");
  if (!price) throw new HttpException(400, "Price can't be blank");

  if (!quantity)
    throw new HttpException(400, "Product quantity can't be blank");

  if (!code) throw new HttpException(400, "Code can't be blank");
  const checkCode = await prisma.details.findUnique({
    where: { code },
  });
  if (checkCode) throw new HttpException(409, "The code already exist");

  if (categoryId.length === 0)
    throw new HttpException(400, "Category id can't be blank");

  let categoryIds = categoryId.map((item) => Number(item));
  const category = await prisma.categories.findMany({
    where: {
      id: {
        in: categoryIds,
      },
    },
  });
  if (!category) throw "Category not found";

  const imageUrls = await imageUploadToFirebase(imageList, "products");
  const product: ProductQueryResponse = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      // Create the new product
      const productField = await tx.products.create({
        data: {},
        include: {
          offers_products: {
            select: { offers: true },
          },
        },
      });

      // Create the product details
      const details = await tx.details.create({
        data: {
          productId: productField.id,
          name: name,
          description: description,
          price: Number(price),
          code,
          tags,
        },
      });

      // Create the product stock
      const stocks = await tx.stocks.create({
        data: {
          productId: productField.id,
          quantity: Number(quantity),
        },
      });

      // Create the product image
      await tx.images.createMany({
        data: imageUrls.map((image) => {
          return {
            productId: productField.id,
            path: image,
          };
        }),
        skipDuplicates: true,
      });

      await tx.categories_Products.createMany({
        data: categoryIds.map((item) => {
          return {
            productId: productField.id,
            categoryId: item,
          };
        }),
        skipDuplicates: true,
      });

      const uom = await tx.uOM.create({
        data: {
          piece: typeof piece === null ? null : Number(piece),
          bora: typeof bora === null ? null : Number(bora),
          carton: typeof carton === null ? null : Number(carton),
          kg: typeof kg === null ? null : Number(kg),
          productId: productField.id,
        },
      });

      const categories = await tx.categories_Products.findMany({
        where: { productId: productField.id },
        select: { category: true },
      });
      return {
        id: productField.id,
        details,
        images: imageUrls,
        stocks,
        category: categories.map((item) => item.category),
        uom,
        offers: productField.offers_products.map((item) => item.offers),
      };
    }
  );

  return productMapper(product);
};

//delete Product
export const deleteProduct = async (
  productId: number,
  userId: number,
  userRole: string
): Promise<ProductDeleteResponse> => {
  if (userRole === "admin" || userRole == "staff") {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } },
    });
    if (checkUser?.manager?.roles.title !== "super admin")
      throw new HttpException(401, "Unauthorized action");
  }

  const product = await prisma.products.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) throw new HttpException(404, "Product not found");

  const images = await prisma.images.findMany({
    where: { productId },
    select: { path: true },
  });
  const imageFilename = images.map((image) =>
    image.path.split("appspot.com/").pop()
  );

  const deletedProduct: ProductDeleteQuery = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const details = await tx.details.delete({
        where: {
          productId: productId,
        },
      });

      const uom = await tx.uOM.delete({
        where: {
          productId,
        },
      });

      // Delete the related product stock
      await tx.stocks.deleteMany({
        where: {
          productId: productId,
        },
      });

      // Delete the related product images
      await tx.images.deleteMany({
        where: {
          productId: productId,
        },
      });

      // Delete the product-category relationship
      await tx.categories_Products.deleteMany({
        where: {
          productId: productId,
        },
      });

      await tx.carts_Products.deleteMany({
        where: { productId },
      });

      await tx.offers_Products.deleteMany({
        where: { productId },
      });
      const productData = await tx.products.delete({
        where: {
          id: productId,
        },
        select: {
          offers_products: {
            select: {
              offers: true,
            },
          },
        },
      });
      return {
        details: details,
        uom,
      };
    }
  );

  await imageFilename.map((imagePath) => {
    return bucket.file(imagePath!).delete();
  });

  return productDeleteMapper(deletedProduct);
};

//get Product by Id
export const getProductById = async (
  productId: number
): Promise<ProductResponse> => {
  const productData = await prisma.products.findUnique({
    where: {
      id: productId,
    },
    select: {
      categories_products: {
        select: { category: true },
      },
      id: true,
      details: true,
      stocks: true,
      images: true,
      uom: true,
      offers_products: { select: { offers: true } },
    },
  });

  if (!productData) throw new HttpException(404, "Product not found");
  const categoriesDetails = productData?.categories_products.map(
    (item) => item.category
  );

  const totalQuantity = productData.stocks.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  productData.stocks[productData.stocks.length - 1].quantity = totalQuantity;

  const productQuery: ProductQueryResponse = {
    id: productData.id,
    details: productData.details!,
    images: productData.images.map((item) => item.path),
    stocks: productData.stocks[productData.stocks.length - 1],
    category: categoriesDetails,
    uom: productData.uom!,
    offers: productData.offers_products.map((item) => item.offers),
  };
  return productMapper(productQuery);
};

//update Product by ID
export const updateProductById = async (
  productId: number,
  productData: ProductCreatePayload,
  userId: number,
  userRole: string
) => {
  if (userRole === "admin" || userRole == "staff") {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } },
    });
    if (checkUser?.manager?.roles.title !== "super admin")
      throw new HttpException(401, "Unauthorized access");
  }

  const checkProduct = await prisma.products.findUnique({
    where: {
      id: productId,
    },
  });
  if (!checkProduct)
    throw new HttpException(404, "Product to be updated not found");

  let {
    name,
    description,
    quantity,
    categoryId,
    price,
    code,
    tags,
    piece,
    bora,
    carton,
    kg,
  } = productData;

  if (!name) throw new HttpException(400, "Product name can't be blank");
  if (!description) throw new HttpException(400, "Description can't be blank");
  if (!price) price = 0;
  if (!quantity)
    throw new HttpException(400, "Product quantity can't be blank");

  if (!code) throw new HttpException(400, "Code can't be blank");
  const checkCode = await prisma.details.findFirst({
    where: {
      code,
      productId: {
        not: productId,
      },
    },
  });
  if (checkCode) throw new HttpException(409, "The code already exist");

  if (categoryId.length === 0)
    throw new HttpException(400, "Category id can't be blank");
  let categoryIds = categoryId.map((item) => Number(item));

  const category = await prisma.categories.findMany({
    where: {
      id: {
        in: categoryIds,
      },
    },
  });
  if (!category) throw "Category not found";

  const product: ProductQueryResponse = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      // update product
      const productField = await tx.products.update({
        where: {
          id: productId,
        },
        data: {
          updatedAt: new Date(),
        },
        include: {
          offers_products: {
            select: {
              offers: true,
            },
          },
        },
      });

      // update product details
      const details = await tx.details.update({
        where: {
          productId,
        },
        data: {
          name: name,
          description: description,
          price: Number(price),
          code,
          updatedAt: new Date(),
        },
      });

      // update product stock
      const stocks = await tx.stocks.create({
        data: {
          productId: productField.id,
          quantity: Number(quantity),
          updatedAt: new Date(),
        },
      });

      const uom = await tx.uOM.update({
        where: {
          productId,
        },
        data: {
          piece: typeof piece === null ? null : Number(piece),
          bora: typeof bora === null ? null : Number(bora),
          carton: typeof carton === null ? null : Number(carton),
          kg: typeof kg === null ? null : Number(kg),
          updatedAt: new Date(),
        },
      });
      // update the categories_product relation
      await updateCategoriesProducts(categoryIds, productId);

      const categories = await tx.categories_Products.findMany({
        where: { productId: productField.id },
        select: { category: true },
      });
      const images = await tx.images.findMany({
        where: { productId: productField.id },
        select: { path: true },
      });

      return {
        id: productField.id,
        details,
        images: images.map((image) => image.path),
        stocks,
        category: categories.map((item) => item.category),
        uom,
        offers: productField.offers_products.map((item) => item.offers),
      };
    }
  );

  return productMapper(product);
};

//get All Products
export const getAllProducts = async (
  page: number,
  size: number,
  storeId: number | undefined
) => {
  const skip = (page - 1) * size;
  if (storeId !== undefined && storeId !== 0) {
    const productsOfStore = await prisma.stores_Products.findMany({
      where: { storeId },
      select: { productId: true },
    });
    const productIds = productsOfStore.map((item) => item.productId);
    const productList = await prisma.products.findMany({
      where: { id: { in: productIds } },
      skip,
      take: size,
      include: {
        details: {
          select: {
            name: true,
            description: true,
            price: true,
            code: true,
            tags: true,
          },
        },
        stocks: {
          select: {
            quantity: true,
          },
        },
        images: {
          select: { path: true },
        },
        uom: {
          select: { piece: true, bora: true, carton: true, kg: true },
        },
        offers_products: {
          select: {
            offers: true,
          },
        },
        categories_products: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    //to calculate total quantities from list of stocks for each product
    const productTotalQuantity = productList.map((product) =>
      product.stocks.reduce((sum, item) => sum + item.quantity, 0)
    );

    type ProductQuery = typeof productList;
    type ProductObject = ProductQuery[number] & { quantity?: number };

    //to map total quantity of each product
    productList.forEach((product: ProductObject, index) => {
      product.quantity = productTotalQuantity[index];
    });

    const totalProducts = productIds.length;
    //to exclude stocks object from array
    const productsToSend = productList.map((product) => {
      const { stocks, ...rest } = product;
      return rest;
    });

    return {
      productsToSend,
      totalProducts: totalProducts,
      totalPages: Math.ceil(totalProducts / size),
      currentPage: page,
    };
  }

  const allStores = await prisma.stores.findMany({
    select: { id: true },
  });
  const storeIds = allStores.map((store) => store.id);

  //Find product IDs linked with each store
  const productsLinkedWithStores = await Promise.all(
    storeIds.map(async (storeId) => {
      const storeProducts = await prisma.stores_Products.findMany({
        where: { storeId },
        select: { productId: true },
      });
      return storeProducts.map((sp) => sp.productId);
    })
  );

  // Get the intersection of all product IDs linked with all stores
  const productIdsCommonInAllStores = productsLinkedWithStores.reduce((a, b) =>
    a.filter((c) => b.includes(c))
  );

  // Fetch the product details for the common product IDs
  const productList = await prisma.products.findMany({
    where: { id: { in: productIdsCommonInAllStores } },
    skip,
    take: size,
    include: {
      details: {
        select: {
          name: true,
          description: true,
          price: true,
          code: true,
          tags: true,
        },
      },
      stocks: {
        select: {
          quantity: true,
        },
      },
      images: {
        select: { path: true },
      },
      uom: {
        select: { piece: true, bora: true, carton: true, kg: true },
      },
      offers_products: {
        select: {
          offers: true,
        },
      },
      categories_products: {
        select: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  //Calculate total quantities from the list of stocks for each product
  const productTotalQuantity = productList.map((product) =>
    product.stocks.reduce((sum, item) => sum + item.quantity, 0)
  );

  type ProductQuery = typeof productList;
  type ProductObject = ProductQuery[number] & { quantity?: number };

  //Map total quantity of each product
  productList.forEach((product: ProductObject, index) => {
    product.quantity = productTotalQuantity[index];
  });

  //Get the total number of products that match the criteria
  const totalProducts = productIdsCommonInAllStores.length;

  //Exclude the stocks object from the array
  const productsToSend = productList.map((product) => {
    const { stocks, ...rest } = product;
    return rest;
  });

  return {
    productsToSend,
    totalProducts,
    totalPages: Math.ceil(totalProducts / size),
    currentPage: page,
  };
};

//upload excel products
export const uploadExcelProducts = async (
  userId: number,
  file: Express.Multer.File,
  storeIds: number[]
) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file.path);

  const worksheet = workbook.getWorksheet(1); // Assuming the first sheet is the relevant one
  const productsData: any[] = [];
  if (!worksheet) throw new HttpException(400, "Worksheet is undefined");

  worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
    if (rowNumber === 1) return; // Skip header row

    const product = {
      key: row.getCell(1).value?.toString(),
      name: row.getCell(2).value?.toString(),
      category: row.getCell(3).value
        ? JSON.parse(row.getCell(3).value!.toString())
        : [],
      offers: row.getCell(4).value
        ? JSON.parse(row.getCell(4).value!.toString())
        : [],
      code: row.getCell(5).value?.toString(),
      tags: row.getCell(6).value?.toString(),
      piece: row.getCell(7).value
        ? parseInt(row.getCell(7).value!.toString())
        : null,
      bora: row.getCell(8).value
        ? parseInt(row.getCell(8).value!.toString())
        : null,
      carton: row.getCell(9).value
        ? parseInt(row.getCell(9).value!.toString())
        : null,
      weight: row.getCell(10).value
        ? parseInt(row.getCell(10).value!.toString())
        : null,
    };

    if (!product.category || product.category.length === 0) {
      throw new HttpException(400, "At least one category must be specified");
    }

    productsData.push(product);
  });
  try {
    const allStoreIds =
      storeIds.length === 0
        ? (await prisma.stores.findMany({ select: { id: true } })).map(
            (store) => store.id
          )
        : storeIds;
    const productsPromises = productsData.map(async (productData) => {
      await prisma.$transaction(async (tx) => {
        const productField = await tx.products.create({
          data: {
            details: {
              create: {
                name: productData.name,
                code: productData.code,
                tags: productData.tags,
                price: 0,
                description: null,
              },
            },
            uom: {
              create: {
                piece: productData.piece,
                bora: productData.bora,
                carton: productData.carton,
                kg: productData.weight,
              },
            },
          },
        });

        //relation creation
        await tx.stores_Products.createMany({
          data: allStoreIds.map((id) => {
            return {
              productId: productField.id,
              storeId: Number(id),
            };
          }),
        });

        const categoryIds = await categoryIdFetch(productData.category);
        await tx.categories_Products.createMany({
          data: categoryIds.map((item) => {
            return {
              productId: productField.id,
              categoryId: item.id,
            };
          }),
          skipDuplicates: true,
        });

        if (productData.offers && productData.offers.length > 0) {
          const offerIds = await offersIdFetch(productData.offers);
          await tx.offers_Products.createMany({
            data: offerIds.map((item) => ({
              productId: productField.id,
              offerId: item.id,
            })),
            skipDuplicates: true,
          });
        }
      });
    });
    await Promise.all(productsPromises);
    return productsPromises;
  } catch (error) {
    console.error(error);
    throw new HttpException(400, "Failed to import products");
  } finally {
    await prisma.$disconnect();
  }
};

//update description
export const updateDescription = async (
  userId: number,
  userRole: string,
  productId: number,
  description: string
) => {
  if (userRole === "admin" || userRole == "staff") {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } },
    });
    if (checkUser?.manager?.roles.title !== "super admin")
      throw new HttpException(401, "Unauthorized access");
  }

  if (!productId) throw new HttpException(400, "Product id not provided");
  const checkProduct = await prisma.products.findUnique({
    where: {
      id: productId,
    },
  });
  if (!checkProduct)
    throw new HttpException(404, "Product to be updated not found");
  
  if (!description) throw new HttpException(400, "Description can't be blank");

  const updatedProduct = await prisma.details.update({
    where: { productId },
    data: {
      description
    }
  })
  // console.log(updatedProduct);
  return updatedProduct;
};

const categoryIdFetch = async (categories: string[]) => {
  try {
    const capitalizedCategories = categories.map(
      (cat) => cat.charAt(0).toUpperCase() + cat.slice(1)
    );

    return await prisma.categories.findMany({
      where: {
        name: {
          in: capitalizedCategories,
        },
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    throw new HttpException(404, "Category not found");
  }
};

const offersIdFetch = async (offers: string[]) => {
  try {
    const capitalizedOffers = offers.map(
      (offer) => offer.charAt(0).toUpperCase() + offer.slice(1)
    );

    return await prisma.offers.findMany({
      where: {
        name: {
          in: capitalizedOffers,
        },
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    throw new HttpException(404, "Offers not found");
  }
};
