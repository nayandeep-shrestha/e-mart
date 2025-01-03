import { offerColumns } from '@/constants';
import { OffersDataType } from '@/types';
import { Table } from 'antd';

export default function OffersTable({
  filteredData,
}: {
  filteredData: OffersDataType[];
}) {
  return (
    <Table
      className="flex-1"
      columns={offerColumns}
      dataSource={filteredData}
      scroll={{ x: 1200 }}
      pagination={{ pageSize: 10 }}
    />
  );
}
