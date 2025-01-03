import { CategoriesHeaderProps } from '@/types';
import { MenuSectionHeader } from '@/ui/Atoms';

export default function StoreUsersHeader({
  searchText,
  onSearch,
  fetchData,
}: Pick<CategoriesHeaderProps, 'searchText' | 'onSearch' | 'fetchData'>) {
  return (
    <MenuSectionHeader
      placeholder="User Name or Company Name"
      showSelect={false}
      searchText={searchText}
      onSearch={onSearch}
      selectedStore={null}
      onStoreChange={null}
      fetchData={fetchData}
    />
  );
}
