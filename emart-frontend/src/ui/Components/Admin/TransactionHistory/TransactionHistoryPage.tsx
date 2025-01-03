'use client';

import { useState, useEffect } from 'react';
import { TransactionParentDataType } from '@/types';
import fetchTransactions from '@/service/transaction.service';
import { Flex } from 'antd';
import { TransactionHistoryHeader, TransactionHistoryTable } from '.';

export default function TransactionHistoryPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<TransactionParentDataType[]>(
    [],
  );
  const [transactionData, setTransactionData] = useState<
    TransactionParentDataType[]
  >([]);

  const fetchData = async () => {
    try {
      const response = await fetchTransactions();
      setTransactionData(response);
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
    const filtered = transactionData.filter((item) =>
      item.storeName.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredData(filtered);
  };
  return (
    <div className="relative h-full p-[2rem]">
      <Flex gap={20} vertical className="h-full">
        <TransactionHistoryHeader
          searchText={searchText}
          onSearch={handleSearch}
          fetchData={fetchData}
        />
        <TransactionHistoryTable filteredData={filteredData} />
      </Flex>
    </div>
  );
}
