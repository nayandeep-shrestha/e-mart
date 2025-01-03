import { CategoryDataType } from '@/types';
import { axiosInstance } from './axiosInstance';

export default async function fetchCategoriesData(): Promise<
  CategoryDataType[]
> {
  const response = await axiosInstance.get<{ msg: string; result: any[] }>(
    '/category/all-categories',
  );
  const categories = response.data.result;
  return categories.map((category) => ({
    key: category.id,
    categoryName: category.name,
  }));
}
