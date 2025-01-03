import { CategoriesHeaderProps } from '@/types';
import { MenuSectionHeader } from '@/ui/Atoms';

export default function StoresHeader({
  searchText,
  onSearch,
  fetchData,
}: Pick<CategoriesHeaderProps, 'searchText' | 'onSearch' | 'fetchData'>) {
  return (
    <MenuSectionHeader
      placeholder="Store"
      showSelect={false}
      searchText={searchText}
      onSearch={onSearch}
      selectedStore={null}
      onStoreChange={null}
      fetchData={fetchData}
    />
  );
}
