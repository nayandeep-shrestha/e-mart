import { StoresDataType } from '@/types';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, TableProps } from 'antd';

const storesColumns = (
  handleStatusChange: (key: string) => void,
  handleEditClick: (row: StoresDataType) => void,
): TableProps<StoresDataType>['columns'] => [
  { title: 'S.N', dataIndex: 'key', key: 'serial' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Contact Person', dataIndex: 'contactPerson', key: 'contactPerson' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
  { title: 'PAN Number', dataIndex: 'pan', key: 'pan' },
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

export default storesColumns;
