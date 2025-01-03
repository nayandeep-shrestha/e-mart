export interface TransactionParentDataType {
  key: React.Key;
  storeName: string;
  address: string;
  email: string;
  pan: string;
  phone: string;
  contactPerson: string;
  children?: TransactionChildDataType[];
}
export interface TransactionChildDataType {
  key: React.Key;
  dateTime: string;
  status: string;
  total: number;
  children?: TransactionSubChildDataType[];
}
export interface TransactionSubChildDataType {
  key: React.Key;
  image: string;
  item: string;
  price: number;
  qty: number;
  uom: string;
}
