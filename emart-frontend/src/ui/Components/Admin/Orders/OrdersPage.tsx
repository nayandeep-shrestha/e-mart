'use client';

import { useEffect, useState } from 'react';
import { Flex } from 'antd';
import { ViewDetailsProvider } from '@/context';
import fetchOrders from '@/service/orders.service';
import { OrderDetails, OrdersHeader, OrdersTable } from './index';

export default function OrdersPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetchOrders();
      setOrdersData(response);
      setFilteredData(response);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const filterData = (search: string, status: string) => {
    let filtered = ordersData.filter((item) =>
      item.storeName.toLowerCase().includes(search.toLowerCase()),
    );

    if (status === 'pending') {
      filtered = filtered.filter((item) => item.pending > 0);
    } else if (status === 'dispatched') {
      filtered = filtered.filter((item) => item.dispatched > 0);
    }

    setFilteredData(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    filterData(value, selectedStatus);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    filterData(searchText, status);
  };
  return (
    <ViewDetailsProvider>
      <div className="relative h-full overflow-hidden p-[2rem]">
        <Flex vertical gap={20} className="h-full">
          <OrdersHeader
            searchText={searchText}
            onSearch={handleSearch}
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
            fetchData={fetchData}
          />
          <OrdersTable
            filteredData={filteredData}
            onViewDetails={setSelectedOrder}
          />
          {selectedOrder && (
            <OrderDetails
              details={selectedOrder.details}
              storeName={selectedOrder.storeName}
              pan={selectedOrder.pan}
              phone={selectedOrder.contactNumber}
              address={selectedOrder.address}
            />
          )}
        </Flex>
      </div>
    </ViewDetailsProvider>
  );
}
