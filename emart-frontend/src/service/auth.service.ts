import { axiosInstance } from './axiosInstance';

export default async function sendOTP(email: string) {
  const response = await axiosInstance.post('/auth/send-otp', {
    email,
  });
  return response.data.result;
}

export async function resendOTP(userId: number) {
  const response = await axiosInstance.post('/auth/resend-otp', {
    id: userId,
  });
  return response.data.result;
}

export async function verifyOTP(userId: number, otp: string) {
  const response = await axiosInstance.post('/auth/verify-otp', {
    id: userId,
    otp,
  });
  return response.data;
}

export async function changePasswordOTP(userId: number, password: string) {
  const response = await axiosInstance.patch('/auth/change-password-otp', {
    userId,
    password,
  });
  return response.data.msg;
}
