import { axiosInstance } from './axiosInstance';

export default async function fetchTransactions() {
  const response = await axiosInstance.get<{ msg: string; result: any[] }>(
    '/transactions',
  );
  return response.data.result;
}
