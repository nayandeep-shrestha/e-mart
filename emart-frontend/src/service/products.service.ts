import { ProductsDataType } from '@/types';
import { axiosInstance } from './axiosInstance';

interface FetchProductsResponse {
  msg: string;
  result: {
    productsToSend: any[];
    totalPages: number;
    currentPage: number;
  };
}

export async function fetchProductsData({
  page = 1,
  size = 5,
  storeId,
}: {
  page?: number;
  size?: number;
  storeId?: number;
} = {}): Promise<{
  products: ProductsDataType[];
  totalPages: number;
  currentPage: number;
}> {
  // Build the query string dynamically
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  // Only append storeId if it is a valid number (not undefined or null)
  if (storeId !== undefined && storeId !== null) {
    queryParams.append('storeId', storeId.toString());
  }

  const response = await axiosInstance.get<FetchProductsResponse>(
    `/products/?${queryParams.toString()}`,
  );

  const products = response.data.result;
  const resultProducts: ProductsDataType[] = products.productsToSend.map(
    (product: any) => {
      const details = product.details || {};
      const categoriesProducts = product.categories_products || [];
      const offers = product.offers_products || [];
      const uom = product.uom || {};

      return {
        key: product.id?.toString() || '',
        product: details.name || '',
        category: categoriesProducts.map(
          (item: { category: { id: number; name: string } }) =>
            item.category.name,
        ),
        offers: offers.map((item: any) => item.offers.name) || '',
        code: details.code || '',
        tags: details.tags || '',
        description: details.description,
        piece: uom.piece || null,
        bora: uom.bora || null,
        carton: uom.carton || null,
        weight: uom.kg || null,
        image: product.images.length > 0 ? product.images[0].path : null,
      };
    },
  );

  return {
    products: resultProducts,
    totalPages: products.totalPages,
    currentPage: products.currentPage,
  };
}

export async function uploadExcel(formData: FormData) {
  const response = await axiosInstance.post(
    '/products/upload-excel',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response;
}

export async function updateDescription(
  productId: number | undefined,
  description: string,
) {
  if (!productId) throw new Error('Product id undefined');
  const response = await axiosInstance.patch('/products/description', {
    productId,
    description,
  });
  return response.data;
}
