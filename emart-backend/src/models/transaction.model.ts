export interface TransactionParentDataType {
  storeName: string;
  address: string;
  email: string;
  pan: string;
  phone: string;
  contactPerson: string;
  children: TransactionChildDataType[];
}
export interface TransactionChildDataType {
  dateTime: string;
  status: string;
  total: number;
  children: TransactionSubChildDataType[];
}
export interface TransactionSubChildDataType {
  image: string;
  item: string;
  price: number;
  qty: number;
  uom: string;
}
