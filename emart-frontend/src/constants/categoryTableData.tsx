'use client';

import { CategoryDataType } from '@/types';
import { UploadImage } from '@/ui/Atoms';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// eslint-disable-next-line import/prefer-default-export
export const categoryColumns = [
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
    render: (record: CategoryDataType) => <UploadImage record={record} />,
  },
  {
    title: 'Category name',
    dataIndex: 'categoryName',
    key: 'categoryName',
  },
];
