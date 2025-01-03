export interface OrderDataType {
  key: string;
  storeName: string;
  contactNumber: string;
  contactPerson: string;
  address: string;
  pendingOrders: number;
  dispatchedOrders: number;
}

// type declaration for order detail section
export interface OrderDetailsProps {
  details: any;
  storeName: string;
  pan: string;
  phone: string;
  address: string;
}

export interface OrderDetailsItem {
  id: string;
  item: string;
  qty: number;
  rate: number;
  total: number;
}

export interface Orders {
  id: string;
  dateTime: string;
  orders: OrderDetailsItem[];
  orderStatus: string;
  paymentStatus: string;
}

export interface OrdersTableProps {
  orders: Orders[];
}
