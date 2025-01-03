import {
  TransactionChildDataType,
  TransactionParentDataType,
  TransactionSubChildDataType,
} from '@/types';
import type { TableColumnsType } from 'antd';

export const parentColumns: TableColumnsType<TransactionParentDataType> = [
  {
    title: 'Company Name',
    dataIndex: 'storeName',
    key: 'storeName',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'PAN No.',
    dataIndex: 'pan',
    key: 'pan',
  },
  {
    title: 'Mobile No.',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Contact Person',
    dataIndex: 'contactPerson',
    key: 'contactPerson',
  },
];

// Child table columns
export const childColumns: TableColumnsType<TransactionChildDataType> = [
  {
    title: 'Order Date',
    dataIndex: 'dateTime',
    key: 'dateTime',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
  },
];

// Sub-child table columns
export const subChildColumns: TableColumnsType<TransactionSubChildDataType> = [
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
  },
  {
    title: 'Item Name',
    dataIndex: 'item',
    key: 'item',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Qty',
    dataIndex: 'qty',
    key: 'qty',
  },
  {
    title: 'Unit Type',
    dataIndex: 'uom',
    key: 'uom',
  },
];
