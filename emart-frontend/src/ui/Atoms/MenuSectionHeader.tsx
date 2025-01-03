import { Flex, Select } from 'antd';
import { CategoriesHeaderProps, SelectOptionType } from '@/types';
import { Reload } from '../Molecules';
import SearchBox from './SearchBox';

const storeOptions: SelectOptionType[] = [
  {
    value: 'all',
    label: 'All Stores',
  },
];

export default function MenuSectionHeader({
  searchText,
  onSearch,
  selectedStore,
  onStoreChange,
  placeholder,
  showSelect,
  fetchData,
}: CategoriesHeaderProps) {
  return (
    <Flex vertical gap={10}>
      <Flex align="center" gap={10}>
        <SearchBox
          placeholder={`Search by ${placeholder} Name`}
          searchText={searchText}
          onSearch={onSearch}
        />
        <Reload fetchData={fetchData} />
      </Flex>
      {showSelect && onStoreChange !== null ? (
        <>
          <Flex align="center" gap={10}>
            <p className="text-[1.25rem] font-medium">Select Store:</p>
            <Select
              defaultValue="All Stores"
              options={storeOptions}
              className="shadow-sm w-[10rem]"
              value={selectedStore}
              onChange={onStoreChange}
            />
          </Flex>
          <p className="text-md text-gray-400">
            Recommended {placeholder} Image Size: 512x512 px
          </p>
        </>
      ) : (
        ''
      )}
    </Flex>
  );
}
