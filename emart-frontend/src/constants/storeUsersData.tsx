import { StoreUsersDataType } from '@/types';
import { Button, TableProps } from 'antd';

const storeUsersColumns = (
  handleStatusChange: (key: string) => void,
  handleResetLink: (row: StoreUsersDataType) => void,
): TableProps<StoreUsersDataType>['columns'] => [
  { title: 'S.N', dataIndex: 'key', key: 'serial' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Phone', dataIndex: 'phoneNumber', key: 'phoneNumber' },
  { title: 'Company Name', dataIndex: 'companyName', key: 'companyName' },
  { title: 'PAN', dataIndex: 'pan', key: 'pan' },
  { title: 'Company Address', dataIndex: 'address', key: 'address' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (_, record) => (
      <span
        className={`${record.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}
      >
        {record.status}
      </span>
    ),
  },
  {
    title: 'Reset Password',
    key: 'reset',
    render: (_, record) => (
      <Button
        className="border-slate h-fit w-full rounded-full bg-transparent px-3 py-1 text-[1rem] font-normal text-[#000000E0] hover:text-blue-500"
        onClick={() => handleResetLink(record)}
      >
        Send Reset Link
      </Button>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Button
        className={`h-fit w-full rounded-full border-none bg-[#0995f7] px-3 py-1 text-[1rem] font-normal text-white ${record.status === 'Active' ? 'hover:bg-red-500' : 'hover:bg-green-500'}`}
        onClick={() => handleStatusChange(record.key)}
      >
        {record.status === 'Active' ? 'De-Activate' : 'Activate'}
      </Button>
    ),
  },
];

export default storeUsersColumns;
