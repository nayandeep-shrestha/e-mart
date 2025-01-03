import React, { useState, useRef } from 'react';
import { Button, Flex, Modal, Select, Tag, message } from 'antd';
import {
  faDownload,
  faUpload,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import exportToExcel from '@/utils/downloadExcel';
import { ProductsDataType } from '@/types';
import { uploadExcel } from '@/service/products.service';

export default function DownloadUploadExcel({
  productsData,
  storeOptions,
}: {
  productsData: ProductsDataType[];
  storeOptions: { value: number; label: string }[];
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedStores, setSelectedStores] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    exportToExcel(productsData, 'Product Data');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      message.success(`${file.name} selected`);
    }
  };

  const handleUpload = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleSaveAll = async () => {
    if (!selectedFile) {
      message.warning('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('storeIds', JSON.stringify([]));

    try {
      const response = await uploadExcel(formData);
      setSelectedFile(null);
      message.success(response.data.msg);
    } catch (error) {
      setSelectedFile(null);
      message.error('Error uploading the file');
    }
  };

  const handleSaveForSpecificStore = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    setIsModalVisible(false);
    if (!selectedStores || selectedStores.length <= 0) {
      message.warning('Store not selected');
      return;
    }

    if (!selectedFile) {
      message.warning('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('storeIds', JSON.stringify(selectedStores));
    try {
      const response = await uploadExcel(formData);
      setSelectedFile(null);
      message.success(response.data.msg);
    } catch (error) {
      setSelectedFile(null);
      message.error('Error uploading the file');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleSelectChange = (value: number[]) => {
    setSelectedStores(value);
  };

  return (
    <Flex gap={8}>
      {!selectedFile && (
        <>
          <Button
            htmlType="button"
            icon={<FontAwesomeIcon icon={faDownload} />}
            onClick={handleDownload}
            className="shadow-lg h-fit rounded-[0.5rem] bg-blue-500 px-4 py-3 text-lg text-white"
          >
            Download Excel File
          </Button>
          <Button
            htmlType="button"
            icon={<FontAwesomeIcon icon={faUpload} />}
            onClick={handleUpload}
            className="shadow-lg h-fit rounded-[0.5rem] bg-blue-500 px-4 py-3 text-lg text-white"
          >
            Upload Excel File
          </Button>
        </>
      )}
      <input
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        accept=".xlsx, .xls"
        onChange={handleFileChange}
      />
      {selectedFile && (
        <>
          <div className="mr-4 flex items-center justify-between overflow-hidden rounded-lg text-lg text-green-500 shadow-custom-sm duration-150">
            <Tag className="border-none bg-white p-2 text-lg">
              {selectedFile.name}
            </Tag>
            <Button
              type="text"
              icon={<FontAwesomeIcon icon={faXmark} />}
              onClick={handleRemoveFile}
              className="h-full bg-gray-200 p-0 hover:bg-slate-300"
              style={{ borderRadius: '0 0.5rem 0.5rem 0' }}
            />
          </div>
          <Button
            onClick={handleSaveForSpecificStore}
            className="shadow-lg h-fit rounded-[0.5rem] bg-blue-500 px-4 py-3 text-lg text-white"
          >
            Save for Specific Store
          </Button>
          <Button
            onClick={handleSaveAll}
            className="shadow-lg h-fit rounded-[0.5rem] bg-blue-500 px-4 py-3 text-lg text-white"
          >
            Save to All Stores
          </Button>
        </>
      )}
      <Modal
        title="Choose Stores"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Select
          mode="multiple"
          size="large"
          placeholder="Please select Stores"
          onChange={handleSelectChange}
          style={{ width: '100%' }}
          options={storeOptions}
        />
      </Modal>
    </Flex>
  );
}
