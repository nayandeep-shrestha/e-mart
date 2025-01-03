import React, { useEffect, useState } from 'react';
import { Button, Drawer, Form, Input, message, Table } from 'antd';
import { StoresDataType } from '@/types';
import { storesColumns } from '@/constants';
import { updateStoreData, updateStoreStatus } from '@/service/stores.service';

const { Item } = Form;

export default function StoresTable({
  filteredData,
}: {
  filteredData: StoresDataType[];
}) {
  const [storesData, setStoresData] = useState<StoresDataType[]>(filteredData);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<StoresDataType | null>(null);

  const handleStatusChange = async (key: string) => {
    try {
      const response = await updateStoreStatus(key);
      setStoresData((prevStores) =>
        prevStores.map((store) => (store.key === key ? response : store)),
      );
      message.success('Store status updated');
    } catch (error) {
      message.error('Failed to update store status');
      console.error(error);
    }
  };
  useEffect(() => {
    setStoresData(filteredData);
  }, [filteredData]);

  const handleEditClick = (row: StoresDataType) => {
    setCurrentRow(row);
    setDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setCurrentRow(null);
  };

  const handleFormSubmit = async (values: {
    name: string;
    address: string;
    contactPerson: string;
    phoneNumber: string;
  }) => {
    try {
      if (currentRow) {
        const response = await updateStoreData(currentRow.key, values);
        setStoresData((prevStores) =>
          prevStores.map((store) =>
            store.key === currentRow?.key ? response : store,
          ),
        );

        message.success('Store details updated successfully');
      }
      handleDrawerClose();
    } catch (error) {
      message.error('Failed to update store data');
      console.error(error);
    }
  };

  return (
    <>
      <Table
        className="flex-1"
        columns={storesColumns(handleStatusChange, handleEditClick)}
        dataSource={storesData}
        scroll={{ x: 1200 }}
        pagination={{ pageSize: 10 }}
      />
      <Drawer
        title={<div className="text-2xl"> Edit Stores Detail</div>}
        width={500}
        onClose={handleDrawerClose}
        open={drawerVisible}
      >
        {currentRow && (
          <Form
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={currentRow}
          >
            <Item name="name" label="Name*">
              <Input className="text-[1.1rem] font-normal" required />
            </Item>
            <Item name="contactPerson" label="Contact Person*">
              <Input className="text-[1.1rem] font-normal" required />
            </Item>
            <Item name="phoneNumber" label="Phone Number*">
              <Input className="text-[1.1rem] font-normal" required />
            </Item>
            <Item name="address" label="Address*">
              <Input className="text-[1.1rem] font-normal" required />
            </Item>
            <Item>
              <Button
                type="primary"
                htmlType="submit"
                className="h-fit w-full rounded-full border-none bg-[#0995f7] px-3 py-2 text-[1.1rem] font-normal text-white"
              >
                Save
              </Button>
            </Item>
          </Form>
        )}
      </Drawer>
    </>
  );
}
