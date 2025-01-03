import { PrismaClient, Prisma } from "@prisma/client";
import {
  CartCreatePayload,
  CartQueryResponse,
  CartResponse,
} from "../models/cart.model";
import HttpException from "../models/http-exception.model";
import { cartMapper } from "../mappers/cart.mapper";
import { OrderAddressCreatePayload, OrderAddressQueryResponse, OrderAddressResponse } from "../models/order_address.model";
import { orderAddressMapper } from "../mappers/order_address.mapper";
const prisma = new PrismaClient();

//add to cart
export const addToCart = async (userId: number, cartData: CartCreatePayload): Promise<CartResponse> => {

  if (typeof cartData === 'undefined') throw new HttpException(400, 'Data not defined');
  const { cart_items } = cartData;
  if (cart_items.length === 0) throw new HttpException(400, "Empty cart data");

  const productIds = cart_items.map((item) => item.productId)

  // Check if all productIds exist in the Products table
  const products = await prisma.products.findMany({
    where: {
      id: { in: productIds },
    },
    select: {
      id: true,
    },
  });

  const foundProductIds = products.map((product) => product.id);

  const missingProductIds = productIds.filter(id => !foundProductIds.includes(id));
  if (missingProductIds.length > 0) {
    throw new HttpException(400, `The following products do not exist: ${missingProductIds.join(', ')}`);
  }

  //Sum of quantities for each product
  const stockLevels = await prisma.stocks.groupBy({
    by: ["productId"],
    where: {
      productId: { in: productIds },
    },
    _sum: {
      quantity: true,
    },
  });

  // Create a map of productId to total stock quantity
  const stockMap = stockLevels.reduce((acc: any, stock: any) => {
    acc[stock.productId] = stock._sum.quantity || 0;
    return acc;
  }, {} as Record<number, number>);

  // Check if requested quantities are available
  for (const item of cart_items) {
    const availableStock = stockMap[item.productId] || 0;
    if (item.quantity > availableStock) {
      throw new HttpException(
        400,
        `Insufficient stock for product ${item.productId}`
      );
    }
  }


  const checkCart = await prisma.carts.findUnique({
    where: { userId }
  })
  //if old cart exist add data to that card
  if (checkCart) {
    // If the cart exists, check each product and update quantity if it exists or add it if it doesn't
    for (const item of cart_items) {
      const existingCartProduct = await prisma.carts_Products.findUnique({
        where: {
          productId_cartId: {
            productId: item.productId,
            cartId: checkCart.id
          }
        }
      });

      if (existingCartProduct) {
        // Update the quantity of the existing product
        await prisma.carts_Products.update({
          where: {
            productId_cartId: {
              productId: item.productId,
              cartId: checkCart.id
            }
          },
          data: {
            quantity: existingCartProduct.quantity + item.quantity,
            subTotal: existingCartProduct.subTotal + item.subTotal,
            updatedAt: new Date()  // Update the timestamp
          }
        });
      } else {
        // Add the new product to the cart
        await prisma.carts_Products.create({
          data: {
            productId: item.productId,
            quantity: item.quantity,
            cartId: checkCart.id,
            rate: item.rate,
            subTotal: item.subTotal
          }
        });
      }
    }

    const updatedCartItems = await prisma.carts_Products.findMany({
      where: {
        cartId: checkCart.id
      }
    });

    return cartMapper({
      id: checkCart.id,
      userId: checkCart.userId,
      cart_items: updatedCartItems,
    });
  }
  const addToCart: CartQueryResponse = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const cart = await prisma.carts.create({
      data: {
        userId
      }
    })
    await prisma.carts_Products.createMany({
      data: cart_items.map((item) => {
        return {
          productId: item.productId,
          quantity: item.quantity,
          subTotal: item.subTotal,
          rate: item.rate,
          cartId: cart.id
        }
      }),
      skipDuplicates: true
    })
    return {
      id: cart.id,
      userId: cart.userId,
      cart_items: cart_items
    }
  })
  return cartMapper(addToCart)

}

//clear cart
export const clearCart = async (userId: number): Promise<CartResponse> => {
  const checkCart = await prisma.carts.findUnique({
    where: { userId }
  })
  if (!checkCart) throw new HttpException(404, "No cart found")

  const cartToClear = await prisma.carts_Products.findMany({
    where: { cartId: checkCart.id }
  })

  if (!cartToClear || cartToClear.length === 0) throw new HttpException(404, "No cart items found")

  await prisma.carts_Products.deleteMany({
    where: {
      cartId: checkCart.id
    }
  })
  return cartMapper({ id: checkCart.id, cart_items: cartToClear })
}

//clear specific items from cart
export const clearItemsFromCart = async (userId: number, productIds: number[]) => {
  const checkCart = await prisma.carts.findUnique({
    where: { userId }
  })
  if (!checkCart) throw new HttpException(404, "No cart found")

  const itemsToClear = await prisma.carts_Products.findMany({
    where: {
      cartId: checkCart.id,
      productId: {
        in: productIds
      }
    }
  })
  if (!itemsToClear || itemsToClear.length === 0) throw new HttpException(404, "Items to clear not found")

  await prisma.carts_Products.deleteMany({
    where: {
      cartId: checkCart.id,
      productId: {
        in: productIds
      }
    }
  })
  return cartMapper({ id: checkCart.id, cart_items: itemsToClear })
}

//view cart
export const viewCart = async (userId: number) => {
  const checkCart = await prisma.carts.findUnique({
    where: { userId },
    include: {
      carts_items: true,
      order_address: true
    }
  })
  if (!checkCart) throw new HttpException(404, "Cart not found")
  if (checkCart.carts_items.length === 0) throw new HttpException(404, "Cart is empty")
  return cartMapper({ id: checkCart.id, cart_items: checkCart.carts_items, orderAddress: checkCart.order_address })
}

//update quantity
export const updateQuantity = async (userId: number, dataToUpdate: CartCreatePayload) => {
  if (typeof dataToUpdate === undefined) throw new HttpException(400, "Data is not defined")
  const { cart_items } = dataToUpdate
  if (!Array.isArray(cart_items) || cart_items.length === 0) throw new HttpException(400, "Data to update is invalid")

  const checkCart = await prisma.carts.findUnique({
    where: { userId },
    include: { carts_items: true }
  })

  if (!checkCart) throw new HttpException(404, "No cart found")

  // check if all provided products to update exist in cart or not
  const existingProductIds = checkCart.carts_items.map(item => item.productId)
  const missingProductIds = cart_items
    .filter(item => !existingProductIds.includes(item.productId))
    .map(item => item.productId);
  if (missingProductIds.length > 0) throw new HttpException(400, `Update failed. Some products do not exist in the cart: ${missingProductIds} `);

  await Promise.all(
    cart_items.map(item =>
      prisma.carts_Products.updateMany({
        where: {
          cartId: checkCart.id,
          productId: item.productId,
        },
        data: {
          quantity: item.quantity,
          subTotal: item.subTotal,
          updatedAt: new Date(),
        },
      })
    )
  );

const updatedCart = await prisma.carts.findUnique({
  where: { id: checkCart.id },
  include: { carts_items: true }
})

if (!updatedCart) throw new HttpException(400, "updated cart not found")
return cartMapper({
  id: updatedCart.id,
  cart_items: updatedCart.carts_items
})

}

//add shipping or biling address
export const addAddress = async (userId: number, addressDetail: OrderAddressCreatePayload): Promise<OrderAddressResponse> => {
  if (typeof addressDetail === undefined) throw new HttpException(400, "Address detail not defined")

  const { fullName, country, city, streetName, type } = addressDetail
  if (!fullName || typeof fullName !== 'string') {
    throw new HttpException(400, 'Invalid fullName');
  }

  if (!country || typeof country !== 'string') {
    throw new HttpException(400, 'Invalid country');
  }

  if (!city || typeof city !== 'string') {
    throw new HttpException(400, 'Invalid city');
  }

  if (!streetName || typeof streetName !== 'string') {
    throw new HttpException(400, 'Invalid streetName');
  }

  if (type !== 'Shipping' && type !== 'Billing') {
    throw new HttpException(400, 'Invalid address type');
  }

  const checkCart = await prisma.carts.findUnique({
    where: { userId }
  })

  if (!checkCart) throw new HttpException(400, "Invalid entry")

  const addedAddress: OrderAddressQueryResponse = await prisma.order_Address.create({
    data: {
      cartId: checkCart.id,
      fullName,
      country,
      city,
      streetName,
      type
    }
  })

  if (!addedAddress) throw new HttpException(400, 'Address addition failed')

  return orderAddressMapper(addedAddress)
}

//edit address
export const editAddress = async (addressId: number, addressDetail: OrderAddressCreatePayload): Promise<OrderAddressResponse> => {
  const checkAddress = await prisma.order_Address.findUnique({
    where: { id: addressId }
  })
  if (!checkAddress) throw new HttpException(404, "Address to be updated not found")

  if (typeof addressDetail === undefined) throw new HttpException(400, "Address detail not defined")

  const { fullName, country, city, streetName, type } = addressDetail
  if (!fullName || typeof fullName !== 'string') {
    throw new HttpException(400, 'Invalid fullName');
  }

  if (!country || typeof country !== 'string') {
    throw new HttpException(400, 'Invalid country');
  }

  if (!city || typeof city !== 'string') {
    throw new HttpException(400, 'Invalid city');
  }

  if (!streetName || typeof streetName !== 'string') {
    throw new HttpException(400, 'Invalid streetName');
  }

  if (type !== 'Shipping' && type !== 'Billing') {
    throw new HttpException(400, 'Invalid address type');
  }

  const addedAddress: OrderAddressQueryResponse = await prisma.order_Address.update({
    where: {
      id: addressId
    },
    data: {
      fullName,
      country,
      city,
      streetName,
      type
    }
  })

  return orderAddressMapper(addedAddress)
}

//delete address
export const deleteAddress = async (addressId: number): Promise<OrderAddressResponse> => {
  const checkAddress = await prisma.order_Address.findUnique({
    where: {
      id: addressId
    }
  })
  if (!checkAddress) throw new HttpException(404, "Address to be deleted not found")

  const deletedAddress: OrderAddressQueryResponse = await prisma.order_Address.delete({
    where: { id: addressId }
  })
  if (!deletedAddress) throw new HttpException(400, "Address deletion failed")
  return orderAddressMapper(deletedAddress)
}