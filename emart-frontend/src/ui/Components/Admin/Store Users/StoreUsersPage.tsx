'use client';

import { useState, useEffect } from 'react';
import { StoreUsersDataType } from '@/types';
import { Flex } from 'antd';
import fetchStoreUsersData from '@/service/storeUsers.service';
import { StoreUsersHeader, StoreUsersTable } from '.';

export default function StoreUsersPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<StoreUsersDataType[]>([]);
  const [storeUsersData, setStoreUsersData] = useState<StoreUsersDataType[]>(
    [],
  );

  const fetchData = async () => {
    try {
      const response = await fetchStoreUsersData();
      setStoreUsersData(response);
      setFilteredData(response);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = storeUsersData.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredData(filtered);
  };
  return (
    <div className="relative h-full overflow-hidden p-[2rem]">
      <Flex gap={20} vertical className="h-full">
        <StoreUsersHeader
          searchText={searchText}
          onSearch={handleSearch}
          fetchData={fetchData}
        />
        <StoreUsersTable filteredData={filteredData} />
      </Flex>
    </div>
  );
}
