import { AdminUsersType } from '@/types';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, TableProps } from 'antd';

const adminUsersColumns = (
  handleStatusChange: (key: string) => void,
  handleEditClick: (row: AdminUsersType) => void,
  handleResetLink: (row: AdminUsersType) => void,
): TableProps<AdminUsersType>['columns'] => [
  { title: 'S.N', dataIndex: 'key', key: 'serial' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Mobile', dataIndex: 'phone', key: 'phone' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
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
  {
    title: 'Edit',
    key: 'edit',
    render: (_, record) => (
      <Button
        className="text-md h-fit w-fit rounded-full border-blue-500 px-2 py-1 text-blue-500 hover:bg-blue-500 hover:text-white"
        onClick={() => handleEditClick(record)}
      >
        <FontAwesomeIcon icon={faPen} />
      </Button>
    ),
  },
];

export default adminUsersColumns;
