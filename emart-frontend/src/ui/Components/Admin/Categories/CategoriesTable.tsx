import { categoryColumns } from '@/constants';
import { CategoryDataType } from '@/types';
import { Table } from 'antd';

export default function CategoriesTable({
  filteredData,
}: {
  filteredData: CategoryDataType[];
}) {
  return (
    <Table
      className="flex-1"
      columns={categoryColumns}
      dataSource={filteredData}
      scroll={{ x: 1200 }}
      pagination={{ pageSize: 10 }}
    />
  );
}
