import { CategoriesHeaderProps } from '@/types';
import { MenuSectionHeader } from '@/ui/Atoms';

export default function OffersHeader({
  searchText,
  onSearch,
  selectedStore,
  onStoreChange,
  fetchData,
}: Omit<CategoriesHeaderProps, 'placeholder' | 'showSelect'>) {
  return (
    <MenuSectionHeader
      placeholder="Offer"
      searchText={searchText}
      onSearch={onSearch}
      selectedStore={selectedStore}
      onStoreChange={onStoreChange}
      showSelect
      fetchData={fetchData}
    />
  );
}
