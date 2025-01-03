'use client';

import { useState, useEffect } from 'react';
import { AdminUsersType } from '@/types';
import { Flex } from 'antd';
import { fetchAdminUsersData } from '@/service/adminUsers.service';
import fetchRoles from '@/service/roles.service';
import { AdminUsersHeader, AdminUsersTable } from '.';

export default function AdminUsersPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<AdminUsersType[]>([]);
  const [adminUsersData, setAdminUsersData] = useState<AdminUsersType[]>([]);
  const [rolesData, setRolesData] = useState<{ id: number; title: string }[]>(
    [],
  );

  const fetchData = async () => {
    try {
      const response = await fetchAdminUsersData();
      setAdminUsersData(response);
      setFilteredData(response);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchRolesData = async () => {
    try {
      const response = await fetchRoles();
      setRolesData(response);
    } catch (error) {
      console.error('Error fetching roles', error);
    }
  };
  useEffect(() => {
    fetchRolesData();
    fetchData();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = adminUsersData.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredData(filtered);
  };
  return (
    <div className="relative h-full overflow-hidden p-[2rem]">
      <Flex gap={20} vertical className="h-full">
        <AdminUsersHeader
          searchText={searchText}
          onSearch={handleSearch}
          fetchData={fetchData}
          roles={rolesData}
        />
        <AdminUsersTable filteredData={filteredData} roles={rolesData} />
      </Flex>
    </div>
  );
}
