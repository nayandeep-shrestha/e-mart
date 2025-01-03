import { OrderStatusOptions } from '@/constants/';
import { SearchBox } from '@/ui/Atoms';
import { Reload } from '@/ui/Molecules';
import { Flex, Select } from 'antd';
import { SearchBoxType } from '@/types';

interface OrderHeaderProps extends SearchBoxType {
  searchText: string;
  onSearch: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  fetchData: () => void;
}

export default function OrdersHeader({
  searchText,
  onSearch,
  selectedStatus,
  onStatusChange,
  fetchData,
}: Omit<OrderHeaderProps, 'placeholder'>) {
  return (
    <Flex wrap gap={10} className="items-center">
      <SearchBox
        placeholder="Search By Store Name"
        searchText={searchText}
        onSearch={onSearch}
      />
      <Select
        defaultValue="all"
        options={OrderStatusOptions}
        className="shadow-sm w-[10rem]"
        value={selectedStatus}
        onChange={onStatusChange}
      />
      <Reload fetchData={fetchData} />
    </Flex>
  );
}
