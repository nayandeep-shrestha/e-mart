import { SelectOptionType } from '@/types';

const OrderStatusOptions: SelectOptionType[] = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Dispatched',
    value: 'dispatched',
  },
];

export default OrderStatusOptions;
