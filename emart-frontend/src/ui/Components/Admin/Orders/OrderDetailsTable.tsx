'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { OrderDetailsItem, Orders, OrdersTableProps } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faTruck } from '@fortawesome/free-solid-svg-icons';
import { updateOrderStatus, updatePayStatus } from '@/service/orders.service';

const { Text } = Typography;

interface ActionsRendererProps {
  order: Orders;
  updateOrderLocally: (orderId: number, status: string) => void;
  updatePayStatusLocally: (orderId: number, status: string) => void;
}

function ActionsRenderer({
  order,
  updateOrderLocally,
  updatePayStatusLocally,
}: ActionsRendererProps) {
  const handleDispatchClick = async () => {
    try {
      await updateOrderStatus({
        orderId: Number(order.id),
        status: 'Dispatched',
      });
      updateOrderLocally(Number(order.id), 'Dispatched');
      message.success('Marked as Dispatched');
    } catch (error) {
      console.error(error);
    }
  };

  const handlePayClick = async () => {
    try {
      await updatePayStatus({
        orderId: Number(order.id),
      });
      updatePayStatusLocally(Number(order.id), 'Paid');
      message.success('Marked as Paid');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Space size="middle">
      {order.paymentStatus === 'Pending' ? (
        <Button
          className="h-fit w-full rounded-full border-none bg-green-600 px-3 py-1 text-[1rem] font-normal text-white"
          onClick={handlePayClick}
        >
          <FontAwesomeIcon icon={faCircleCheck} />
          Mark as Paid
        </Button>
      ) : (
        <Button
          className="h-fit w-full rounded-full border-none bg-[#be48f9] px-3 py-1 text-[1rem] font-normal text-white"
          onClick={handleDispatchClick}
        >
          <FontAwesomeIcon icon={faTruck} />
          Mark as Dispatched
        </Button>
      )}
    </Space>
  );
}
export default function OrderDetailsTable({ orders }: OrdersTableProps) {
  const [localOrders, setLocalOrders] = useState(orders);

  const updateOrderLocally = (orderId: number, status: string) => {
    setLocalOrders((prevOrders) =>
      prevOrders.map((order) =>
        Number(order.id) === orderId
          ? { ...order, orderStatus: status }
          : order,
      ),
    );
  };

  const updatePayStatusLocally = (orderId: number, status: string) => {
    setLocalOrders((prevOrders) =>
      prevOrders.map((order) =>
        Number(order.id) === orderId
          ? { ...order, paymentStatus: status }
          : order,
      ),
    );
  };

  const itemColumns: ColumnsType<OrderDetailsItem> = [
    {
      title: 'Index',
      dataIndex: 'index',
      key: 'index',
      render: (text: string, record: any, index: number) => index + 1,
    },
    { title: 'Item', dataIndex: 'item', key: 'item' },
    { title: 'Qty', dataIndex: 'qty', key: 'qty' },
    { title: 'Rate', dataIndex: 'rate', key: 'rate' },
    { title: 'Total', dataIndex: 'total', key: 'total' },
  ];

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  return (
    <div className="flex-1">
      {localOrders
        .filter((order) => order.orderStatus === 'Pending')
        .map((order) => (
          <div key={order.id} className="mb-[20px]">
            <div className="mb-2.5 flex items-center justify-between rounded-md border border-gray-200 p-2.5">
              <Text strong>{order.dateTime}</Text>
              <ActionsRenderer
                order={order}
                updateOrderLocally={updateOrderLocally}
                updatePayStatusLocally={updatePayStatusLocally}
              />
            </div>
            <Table
              columns={itemColumns}
              dataSource={order.orders}
              pagination={false}
              rowKey={(item) => item.id}
            />
          </div>
        ))}
    </div>
  );
}
