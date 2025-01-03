import { SearchBoxType } from '@/types';
import { Input } from 'antd';

export default function SearchBox({
  placeholder,
  searchText,
  onSearch,
}: SearchBoxType) {
  const { length } = placeholder;
  return (
    <div className="search-box relative mb-[1rem] mt-4 flex items-center ">
      <Input
        allowClear
        placeholder={placeholder}
        value={searchText}
        className="shadow-sm rounded-[1rem] px-3 py-2 text-[1.25rem] outline-none"
        style={{ width: `${length}ch` }}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
