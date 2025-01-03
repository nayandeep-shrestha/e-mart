'use client';

import { useEffect, useState } from 'react';
import { Flex } from 'antd';
import { StoresDataType } from '@/types';
import { fetchStoresData } from '@/service/stores.service';
import StoresHeader from './StoresHeader';
import StoresTable from './StoresTable';

export default function StoresPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<StoresDataType[]>([]);
  const [storesData, setStoresData] = useState<StoresDataType[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetchStoresData();
      setStoresData(response);
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
    const filtered = storesData.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  return (
    <div className="relative h-full overflow-hidden p-[2rem]">
      <Flex gap={20} vertical className="h-full">
        <StoresHeader
          searchText={searchText}
          onSearch={handleSearch}
          fetchData={fetchData}
        />
        <StoresTable filteredData={filteredData} />
      </Flex>
    </div>
  );
}
