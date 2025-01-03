import { axiosInstance } from './axiosInstance';

export default async function resetLink(email: string) {
  const response = await axiosInstance.post('/auth/reset-link', {
    email,
  });
  return response.data.msg;
}

export async function changePassword(token: string, password: string) {
  const response = await axiosInstance.patch('/auth/change-password', {
    token,
    password,
  });
  return response.data.msg;
}
