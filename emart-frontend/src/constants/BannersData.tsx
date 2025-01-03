import { BannersDataType } from '@/types';
import { UploadImage } from '@/ui/Atoms';
import { Button, TableProps } from 'antd';

const getBannersColumns = (
  handleDelete: (key: number) => void,
): TableProps<BannersDataType>['columns'] => [
  {
    title: 'S.N',
    dataIndex: 'key',
    key: 'serial',
    width: 80,
  },
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
    width: 100,
    render: (image: string, record: BannersDataType) => (
      <UploadImage imageUrl={image} record={record} />
    ),
  },
  {
    title: 'Banner Name',
    dataIndex: 'bannerName',
    key: 'bannerName',
  },
  {
    title: 'Action',
    key: 'action',
    width: 100,
    render: (_, record) => (
      <Button
        className="h-fit w-fit rounded-full border-red-500  px-3 py-1 text-[1rem] font-normal text-red-500  hover:border-none hover:bg-red-500 hover:text-white"
        onClick={() => handleDelete(Number(record.key))}
      >
        Delete
      </Button>
    ),
  },
];

export default getBannersColumns;
