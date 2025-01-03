import React, { useContext } from 'react';
import { ViewDetailsContext } from '@/context/ViewDetails';
import { Button, Flex } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { OrderDetailsProps } from '@/types';
import OrderDetailsTable from './OrderDetailsTable';

export default function OrderDetails({
  details,
  storeName,
  pan,
  phone,
  address,
}: OrderDetailsProps) {
  const { collapse, setCollapse } = useContext(ViewDetailsContext);

  const handleDetailsView = () => {
    setCollapse(true);
  };
  return (
    <div
      className={`${collapse ? 'top-[100%]' : 'top-0'}  absolute left-0 flex h-full w-[100%] flex-col gap-8 overflow-y-auto bg-white p-[3rem] transition-all duration-300 ease-in-out`}
    >
      <Flex className="items-center">
        <Flex vertical className="flex-1" gap={4}>
          <h2 className="text-[2.5rem] font-normal">{storeName}</h2>
          <Flex gap={10}>
            <p className="text-[1.1rem] font-medium">
              Phone:{' '}
              <span className="text-[1.05rem] font-normal text-gray-500">
                {phone}
              </span>
            </p>
            <p className="text-[1.1rem] font-medium">
              PAN:{' '}
              <span className="text-[1.05rem] font-normal text-gray-500">
                {pan}
              </span>
            </p>
            <p className="text-[1.1rem] font-medium">
              Address:{' '}
              <span className="text-[1.05rem] font-normal text-gray-500">
                {address}
              </span>
            </p>
          </Flex>
        </Flex>
        <Button
          icon={<FontAwesomeIcon icon={faXmark} />}
          className="shadow-sm h-auto rounded-3xl border-0 bg-red-500 py-1 text-[1.1rem] font-medium text-white hover:border-[1px] hover:border-red-500 hover:bg-transparent hover:text-red-500"
          onClick={handleDetailsView}
        >
          Close
        </Button>
      </Flex>
      <OrderDetailsTable orders={details} />
    </div>
  );
}
