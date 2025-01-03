import { ProductsDataType, SearchBoxType } from '@/types';
import { SearchBox } from '@/ui/Atoms';
import { Reload } from '@/ui/Molecules';
import { Flex, Select } from 'antd';
import DownloadUploadExcel from './DownloadUploadExcel';

export interface ProductsHeaderProps extends SearchBoxType {
  searchText: string;
  onSearch: (value: string) => void;
  selectedStore: number;
  onStoreChange: (status: number) => void;
  fetchData: () => void;
  storeOptions: { value: number; label: string }[];
  productsData: ProductsDataType[];
}

export default function ProductsHeader({
  searchText,
  onSearch,
  selectedStore,
  onStoreChange,
  fetchData,
  productsData,
  storeOptions,
}: Omit<ProductsHeaderProps, 'placeholder'>) {
  return (
    <Flex vertical gap={10}>
      <Flex align="center">
        <Flex className="mr-auto" align="center" gap={8}>
          <SearchBox
            placeholder="Search by Product Name"
            searchText={searchText}
            onSearch={onSearch}
          />
          <Reload fetchData={fetchData} />
        </Flex>
        <DownloadUploadExcel
          productsData={productsData}
          storeOptions={storeOptions}
        />
      </Flex>
      <Flex align="center" gap={10}>
        <p className="text-[1.25rem] font-medium">Select Store:</p>
        <Select
          defaultValue={0}
          options={storeOptions}
          className="shadow-sm w-[10rem]"
          value={selectedStore}
          onChange={onStoreChange}
        />
      </Flex>
      <p className="text-md text-gray-400">
        Recommended Product Image Size: 512x512 px
      </p>
    </Flex>
  );
}
