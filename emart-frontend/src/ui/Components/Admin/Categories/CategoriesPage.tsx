'use client';

import { useEffect, useState } from 'react';
import { Flex } from 'antd';
import { CategoryDataType } from '@/types';
import fetchCategoriesData from '@/service/category.service';
import { CategoriesHeader, CategoriesTable } from '.';

export default function CategoriesPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [filteredData, setFilteredData] = useState<CategoryDataType[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataType[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetchCategoriesData();
      setCategoryData(response);
      setFilteredData(response);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const filterData = (search: string, store: string) => {
    const filtered = categoryData.filter((item) =>
      item.categoryName.toLowerCase().includes(search.toLowerCase()),
    );
    console.log(store);
    setFilteredData(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = categoryData.filter((item) =>
      item.categoryName.toLowerCase().includes(value.toLowerCase()),
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
        <CategoriesHeader
          searchText={searchText}
          onSearch={handleSearch}
          selectedStore={selectedStore}
          onStoreChange={handleStoreChange}
          fetchData={fetchData}
        />
        <CategoriesTable filteredData={filteredData} />
      </Flex>
    </div>
  );
}
