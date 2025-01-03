'use client';

import { useState, useEffect } from 'react';
import { Flex } from 'antd';
import { PaginationState, ProductsDataType } from '@/types';
import { fetchProductsData } from '@/service/products.service';
import { fetchStores } from '@/service/stores.service';
import { ProductsHeader, ProductsTable } from '.';

export default function ProductsPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedStore, setSelectedStore] = useState<number>(0);
  const [productsData, setProductsData] = useState<ProductsDataType[]>([]);
  const [filteredData, setFilteredData] = useState<ProductsDataType[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    totalPages: 0,
    currentPage: 1,
  });
  const [storesData, setStoresData] = useState<
    { value: number; label: string }[]
  >([]);
  const fetchData = async (page = 1, storeId?: number, size = 5) => {
    try {
      const response = await fetchProductsData({ page, size, storeId });
      setProductsData(response.products);
      setFilteredData(response.products);
      setPagination({
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  const fetchAllStore = async () => {
    try {
      const response = await fetchStores();
      setStoresData(response);
    } catch (error) {
      console.error('Error fetching stores: ', error);
    }
  };
  useEffect(() => {
    fetchAllStore();
  }, []);

  useEffect(() => {
    fetchData(pagination.currentPage, selectedStore);
  }, [pagination.currentPage, selectedStore]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = productsData.filter((item) =>
      item.product.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  const handleStoreChange = (storeId: number) => {
    setSelectedStore(storeId);
    if (storeId === 0) fetchData(pagination.currentPage);
    fetchData(pagination.currentPage, storeId);
  };

  return (
    <div className="relative h-full overflow-hidden p-[2rem]">
      <Flex gap={20} vertical className="h-full">
        <ProductsHeader
          searchText={searchText}
          onSearch={handleSearch}
          selectedStore={selectedStore}
          onStoreChange={handleStoreChange}
          fetchData={fetchData}
          productsData={productsData}
          storeOptions={storesData}
        />
        <ProductsTable
          filteredData={filteredData}
          pagination={pagination}
          setPagination={setPagination}
        />
      </Flex>
    </div>
  );
}
