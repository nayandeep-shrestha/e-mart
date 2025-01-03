import React, { useEffect, useState } from 'react';
import { Button, Drawer, Form, Input, message, Select, Table } from 'antd';
import { AdminUsersType } from '@/types';
import { adminUsersColumns } from '@/constants';
import {
  updateAdminUserData,
  updateAdminUsersStatus,
} from '@/service/adminUsers.service';
import resetLink from '@/service/passwordReset.service';

const { Item } = Form;
const { Option } = Select;

export default function AdminUsersTable({
  filteredData,
  roles,
}: {
  filteredData: AdminUsersType[];
  roles: { id: number; title: string }[];
}) {
  const [adminUsersData, setAdminUsersData] =
    useState<AdminUsersType[]>(filteredData);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<AdminUsersType | null>(null);

  const handleStatusChange = async (key: string) => {
    try {
      const response = await updateAdminUsersStatus(key);
      setAdminUsersData((prevUser) =>
        prevUser.map((user) => (user.key === key ? response : user)),
      );
      message.success('Admin user status updated');
    } catch (error) {
      message.error('Failed to update admin user status');
      console.error(error);
    }
  };

  useEffect(() => {
    setAdminUsersData(filteredData);
  }, [filteredData]);

  const handleEditClick = (row: AdminUsersType) => {
    setCurrentRow(row);
    setDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setCurrentRow(null);
  };

  const handleFormSubmit = async (values: {
    name: string;
    phone: string;
    role: number;
  }) => {
    try {
      if (currentRow) {
        const response = await updateAdminUserData(currentRow.key, values);
        setAdminUsersData((prevData) =>
          prevData.map((user) =>
            user.key === currentRow?.key ? response : user,
          ),
        );

        message.success('User details updated successfully');
      }
      handleDrawerClose();
    } catch (error) {
      message.error('Failed to update user data');
      console.error(error);
    }
  };

  const handleResetLink = async (row: AdminUsersType) => {
    try {
      const response = await resetLink(row.email);
      message.success(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Table
        className="flex-1"
        columns={adminUsersColumns(
          handleStatusChange,
          handleEditClick,
          handleResetLink,
        )}
        dataSource={adminUsersData}
        scroll={{ x: 1200 }}
        pagination={{ pageSize: 10 }}
      />
      <Drawer
        title={<div className="text-2xl"> Update User</div>}
        width={500}
        onClose={handleDrawerClose}
        open={drawerVisible}
      >
        {currentRow && (
          <Form
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={{
              ...currentRow,
              role: roles.find((role) => role.title === currentRow.role)?.id,
            }} // Convert currentRow.role to corresponding role id
          >
            <Item name="name" label="Name*">
              <Input className="text-[1.1rem] font-normal" required />
            </Item>
            <Item name="phone" label="Mobile Number*">
              <Input className="text-[1.1rem] font-normal" required />
            </Item>
            <Item name="role" label="Role*">
              <Select
                className="text-[1.1rem] font-normal"
                disabled={currentRow.role.toLowerCase() === 'super admin'}
              >
                {roles.map((role) => (
                  <Option key={role.id} value={role.id}>
                    {role.title}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item>
              <Button
                type="primary"
                htmlType="submit"
                className="h-fit w-full rounded-full border-none bg-[#0995f7] px-3 py-2 text-[1.1rem] font-normal text-white"
              >
                Update
              </Button>
            </Item>
          </Form>
        )}
      </Drawer>
    </>
  );
}
