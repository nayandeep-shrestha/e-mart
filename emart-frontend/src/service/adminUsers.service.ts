import { AdminUsersType } from '@/types';
import { axiosInstance } from './axiosInstance';

export async function fetchAdminUsersData(): Promise<AdminUsersType[]> {
  const response = await axiosInstance.get<{ msg: string; result: any[] }>(
    '/users/admin-users',
  );
  const adminUsers = response.data.result;
  return adminUsers.map((user) => ({
    key: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
  }));
}

export async function updateAdminUsersStatus(
  key: string,
): Promise<AdminUsersType> {
  const response = await axiosInstance.patch(
    `/users/update-admin-users/${key}`,
  );
  const adminUser = response.data.result;
  return {
    key: adminUser.id,
    name: adminUser.name,
    email: adminUser.email,
    phone: adminUser.phone,
    role: adminUser.role,
    status: adminUser.status,
  };
}

export async function updateAdminUserData(
  key: string,
  dataToUpdate: {
    name: string;
    phone: string;
    role: number;
  },
) {
  const response = await axiosInstance.patch<{ msg: string; result: any }>(
    `/users/${key}`,
    {
      name: dataToUpdate.name,
      phone: dataToUpdate.phone,
      roleId: dataToUpdate.role,
    },
  );

  const adminUser = response.data.result;
  return {
    key: adminUser.id,
    name: adminUser.name,
    email: adminUser.email,
    phone: adminUser.phone,
    status: adminUser.status,
    role: adminUser.role,
  };
}

export async function addAdminUser(newUser: {
  role: number;
  name: string;
  email: string;
  phone: string;
  confirmPassword: string;
  password: string;
}) {
  const response = await axiosInstance.post('/users/', {
    roleId: newUser.role,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    password: newUser.confirmPassword,
  });

  const createdUser = response.data.result;
  return {
    key: createdUser.id,
    name: createdUser.name,
    email: createdUser.email,
    phone: createdUser.phone,
    status: createdUser.status,
    role: createdUser.role,
  };
}
