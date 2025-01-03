export interface AdminUsersType {
  key: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'Active' | 'Inactive';
}
