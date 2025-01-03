'use client';

import { OffersDataType } from '@/types';
import { UploadImage } from '@/ui/Atoms';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TableProps } from 'antd';

const offerColumns: TableProps<OffersDataType>['columns'] = [
  {
    title: 'Order',
    dataIndex: 'order',
    key: 'order',
    width: 30,
    render: () => <FontAwesomeIcon icon={faBars} className="text-[1.2rem]" />,
  },
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
    width: 100,
    render: (image: string, record: OffersDataType) => (
      <UploadImage imageUrl={image} record={record} />
    ),
  },
  {
    title: 'Offer Name',
    dataIndex: 'offerName',
    key: 'offerName',
  },
];

export default offerColumns;
