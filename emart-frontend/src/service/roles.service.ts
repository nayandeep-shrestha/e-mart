import { axiosInstance } from './axiosInstance';

async function fetchRoles() {
  const response = await axiosInstance.get<{ msg: string; result: any[] }>(
    '/auth/user-roles',
  );
  const roles = response.data.result;
  return roles.map((role) => ({
    id: role.id,
    title: role.title,
  }));
}

export default fetchRoles;
