import { SearchBoxType } from './SearchBoxType';

export interface HeaderProps extends SearchBoxType {
  searchText: string;
  onSearch: (value: string) => void;
  selectedStore: string | null;
  onStoreChange: ((status: string) => void) | null;
  showSelect: boolean;
}
