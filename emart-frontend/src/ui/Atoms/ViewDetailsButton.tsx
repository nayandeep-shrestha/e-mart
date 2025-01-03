'use client';

import { Button } from 'antd';
import React, { useContext } from 'react';
import { ViewDetailsContext } from '@/context/';

export default function ViewDetailsButton({
  onViewDetails,
  order,
}: {
  onViewDetails: (order: any) => void;
  order: any;
}) {
  const { setCollapse } = useContext(ViewDetailsContext);
  const handleDetailsView = () => {
    setCollapse(false);
    onViewDetails(order);
  };

  return (
    <Button
      className="h-fit w-full rounded-full bg-[#0995f7] px-3 py-1 text-[1rem] font-normal text-white hover:border-blue-500 hover:bg-white hover:text-blue-500"
      onClick={handleDetailsView}
    >
      View Details
    </Button>
  );
}
