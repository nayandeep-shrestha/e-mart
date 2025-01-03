'use client';

import { getBannersColumns } from '@/constants';
import {
  fetchBannersData,
  deleteBanner,
  addBanner,
} from '@/service/banner.service';
import { BannersDataType } from '@/types';
import { FormInput } from '@/ui/Molecules';
import '@/styles/index';
import { Button, Drawer, Form, message, Table } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function BannerSection() {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [bannerTableData, setBannerTableData] = useState<BannersDataType[]>([]);

  const fetchBanner = async () => {
    try {
      const response = await fetchBannersData();
      setBannerTableData(response);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.error.toLowerCase() !== 'no banners found')
          message.error(error.response.data.error);
        setBannerTableData([]);
        message.error(error.response.data.error);
      } else {
        message.error('An unexpected error occurred');
      }
    }
  };
  useEffect(() => {
    fetchBanner();
  }, []);

  const handleDelete = async (bannerId: number) => {
    try {
      const response = await deleteBanner(bannerId);
      message.success(response);
      fetchBanner();
    } catch (error) {
      console.error(error);
      message.success('Failed to delete banner');
    }
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
  };

  const handleFormSubmit = async (values: { bannerName: string }) => {
    try {
      const response = await addBanner(values.bannerName);
      message.success(response);
      fetchBanner();
    } catch (error) {
      message.error('Failed to add banner');
      console.error(error);
    } finally {
      handleDrawerClose();
    }
  };
  console.log(bannerTableData);
  return (
    <main className="mb-2 overflow-hidden pt-14">
      <p className="text-2xl font-bold">Banner</p>
      <Button
        className="shadow-lg mt-5 h-fit w-fit rounded-[0.5rem] bg-blue-500 px-4 py-2 text-lg text-white"
        onClick={() => setDrawerVisible(true)}
      >
        Add New Banner
      </Button>
      <p className="text-md mt-3 font-normal text-slate-500">
        Recommended Banner Image Size: 512x512 px
      </p>
      <Table
        className="mt-5"
        columns={getBannersColumns(handleDelete)}
        dataSource={bannerTableData}
        scroll={{ y: 280 }}
        pagination={false}
      />
      <Drawer
        title={<div className="text-2xl">Add User</div>}
        width={500}
        onClose={handleDrawerClose}
        open={drawerVisible}
      >
        <Form layout="vertical" onFinish={handleFormSubmit}>
          <FormInput
            name="bannerName"
            label="Banner Name*"
            placeholder=""
            type="text"
            required
          />
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="h-fit w-full rounded-full border-none bg-[#0995f7] px-3 py-2 text-[1.1rem] font-normal text-white"
            >
              Add Banner
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </main>
  );
}
