import { ProductsDataType } from '@/types';
import { UploadImage } from '@/ui/Atoms';
import { faBars, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, TableProps } from 'antd';

// eslint-disable-next-line import/prefer-default-export
export const productsColumns = (
  handleEditClick: (row: ProductsDataType) => void,
): TableProps<ProductsDataType>['columns'] => [
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
    render: (image: string, record: ProductsDataType) => (
      <UploadImage imageUrl={image} record={record} />
    ),
  },
  {
    title: 'Product Name',
    dataIndex: 'product',
    key: 'product',
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    render: (categories) => (
      <div>{Array.isArray(categories) ? categories.join(', ') : ''}</div>
    ),
  },
  {
    title: 'Offers',
    dataIndex: 'offers',
    key: 'offers',
    render: (offers) => (
      <div>{Array.isArray(offers) ? offers.join(', ') : ''}</div>
    ),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    render: (description) => (
      <div
        className="custom-list-style truncate-multiline"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    ),
  },
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    key: 'tags',
  },
  {
    title: 'Piece',
    dataIndex: 'piece',
    key: 'piece',
  },
  {
    title: 'Bora',
    dataIndex: 'bora',
    key: 'bora',
  },
  {
    title: 'Carton',
    dataIndex: 'carton',
    key: 'carton',
  },
  {
    title: 'Kg',
    dataIndex: 'weight',
    key: 'weight',
  },
  {
    title: 'Edit',
    key: 'edit',
    render: (_, record) => (
      <Button
        className="text-md h-fit w-fit rounded-full border-blue-500 px-2 py-1 text-blue-500 hover:bg-blue-500 hover:text-white"
        onClick={() => handleEditClick(record)}
      >
        <FontAwesomeIcon icon={faPen} />
      </Button>
    ),
  },
];
