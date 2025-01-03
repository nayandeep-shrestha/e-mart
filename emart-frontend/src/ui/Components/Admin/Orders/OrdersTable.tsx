import { OrderDataType } from '@/types';
import { Table } from 'antd';
import { ViewDetailsButton } from '@/ui/Atoms';

export default function OrdersTable({
  filteredData,
  onViewDetails,
}: {
  filteredData: OrderDataType[];
  onViewDetails: (order: any) => void;
}) {
  const columns = [
    {
      title: 'S.N',
      dataIndex: 'key',
      key: 'serial',
    },
    {
      title: 'Store Name',
      dataIndex: 'storeName',
      key: 'storeName',
    },
    {
      title: 'Contact Number',
      dataIndex: 'contactNumber',
      key: 'contactNumber',
    },
    {
      title: 'Contact Person',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Pending Orders',
      dataIndex: 'pending',
      key: 'pending',
    },
    {
      title: 'Dispatched Orders',
      dataIndex: 'dispatched',
      key: 'dispatched',
    },
    {
      title: 'Detail',
      key: 'detail',
      render: (_: any, record: any) => (
        <ViewDetailsButton onViewDetails={onViewDetails} order={record} />
      ),
    },
  ];

  return (
    <Table
      className="flex-1"
      columns={columns}
      dataSource={filteredData}
      pagination={{ pageSize: 8 }}
      scroll={{ x: 1200 }}
    />
  );
}
