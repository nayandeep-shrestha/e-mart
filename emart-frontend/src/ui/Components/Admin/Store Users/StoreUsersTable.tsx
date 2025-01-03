import { storeUsersColumns } from '@/constants';
import resetLink from '@/service/passwordReset.service';
import { updateStoreUsersStatus } from '@/service/storeUsers.service';
import { StoreUsersDataType } from '@/types';
import { message, Table } from 'antd';
import { useEffect, useState } from 'react';

export default function StoreUsersTable({
  filteredData,
}: {
  filteredData: StoreUsersDataType[];
}) {
  const [storeUsersData, setStoreUsersData] =
    useState<StoreUsersDataType[]>(filteredData);
  useEffect(() => {
    setStoreUsersData(filteredData);
  }, [filteredData]);

  const handleStatusChange = async (key: string) => {
    try {
      const response = await updateStoreUsersStatus(key);
      setStoreUsersData((prevUser) =>
        prevUser.map((user) => (user.key === key ? response : user)),
      );
      message.success('Store user status updated');
    } catch (error) {
      message.error('Failed to update store user status');
      console.error(error);
    }
  };
  const handleResetLink = async (row: StoreUsersDataType) => {
    try {
      const response = await resetLink(row.email);
      message.success(response);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Table
      className="flex-1"
      columns={storeUsersColumns(handleStatusChange, handleResetLink)}
      dataSource={storeUsersData}
      scroll={{ x: 1200 }}
      pagination={{ pageSize: 10 }}
    />
  );
}
