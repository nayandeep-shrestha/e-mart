import { axiosInstance } from './axiosInstance';

export default async function fetchOrders() {
  const response = await axiosInstance.get<{ msg: string; result: any[] }>(
    '/orders/lists',
  );
  return response.data.result;
}

export async function updateOrderStatus({
  orderId,
  status,
}: {
  orderId: number;
  status: string;
}) {
  const response = await axiosInstance.patch<{ msg: string; result: any[] }>(
    `/orders/${orderId}/updateStatus`,
    {
      status,
    },
  );
  return response.data.result;
}

export async function updatePayStatus({ orderId }: { orderId: number }) {
  const response = await axiosInstance.patch<{ msg: string; result: any[] }>(
    `/orders/${orderId}/payStatus`,
  );
  return response.data.result;
}
