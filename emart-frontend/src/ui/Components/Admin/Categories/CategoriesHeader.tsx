import { MenuSectionHeader } from '@/ui/Atoms';
import { CategoriesHeaderProps } from '@/types';

export default function CategorieshHeader({
  searchText,
  onSearch,
  selectedStore,
  onStoreChange,
  fetchData,
}: Omit<CategoriesHeaderProps, 'placeholder' | 'showSelect'>) {
  return (
    <MenuSectionHeader
      placeholder="Category"
      showSelect
      searchText={searchText}
      onSearch={onSearch}
      selectedStore={selectedStore}
      onStoreChange={onStoreChange}
      fetchData={fetchData}
    />
  );
}
