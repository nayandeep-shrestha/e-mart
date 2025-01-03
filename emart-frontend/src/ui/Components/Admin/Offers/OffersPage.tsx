'use client';

import { useEffect, useState } from 'react';
import { OffersDataType } from '@/types';
import { Flex } from 'antd';
import fetchOffersData from '@/service/offers.service';
import { OffersHeader, OffersTable } from '.';

export default function OffersPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [filteredData, setFilteredData] = useState<OffersDataType[]>([]);
  const [offerData, setOfferData] = useState<OffersDataType[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetchOffersData();
      setOfferData(response);
      setFilteredData(response);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const filterData = (search: string, store: string) => {
    const filtered = offerData.filter((item) =>
      item.offerName.toLowerCase().includes(search.toLowerCase()),
    );
    console.log(store);
    setFilteredData(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = offerData.filter((item) =>
      item.offerName.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  const handleStoreChange = (store: string) => {
    setSelectedStore(store);
    filterData(searchText, store);
  };
  return (
    <div className="relative h-full overflow-hidden p-[2rem]">
      <Flex gap={20} vertical className="h-full">
        <OffersHeader
          searchText={searchText}
          onSearch={handleSearch}
          selectedStore={selectedStore}
          onStoreChange={handleStoreChange}
          fetchData={fetchData}
        />
        <OffersTable filteredData={filteredData} />
      </Flex>
    </div>
  );
}
