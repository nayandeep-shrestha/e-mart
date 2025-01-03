import { productsColumns } from '@/constants';
import { PaginationState, ProductsDataType } from '@/types';
import { Dispatch, SetStateAction, useState } from 'react';
import { Table, PaginationProps, Drawer, Form, Button, message } from 'antd';
import { itemRender } from '@/utils';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { updateDescription } from '@/service/products.service';

export default function ProductsTable({
  filteredData,
  pagination,
  setPagination,
}: {
  filteredData: ProductsDataType[];
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
}) {
  const customPaginationProps: PaginationProps = {
    current: pagination.currentPage,
    pageSize: 5,
    total: pagination.totalPages * 5,
    onChange: (page) => {
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
      }));
    },
    showSizeChanger: false,
    showQuickJumper: false,
    itemRender: (page, type, originalElement) =>
      itemRender(
        page,
        type,
        originalElement,
        pagination.totalPages,
        pagination.currentPage,
      ),
  };

  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editorData, setEditorData] = useState('');
  const [currentRow, setCurrentRow] = useState<ProductsDataType | null>(null);

  const handleEditClick = (row: ProductsDataType) => {
    setCurrentRow(row);
    setDrawerVisible(true);
  };
  const handleDrawerClose = () => {
    setDrawerVisible(false);
  };

  const handleFormSubmit = async () => {
    try {
      if (!editorData) {
        message.error('Nothing to save');
        return;
      }
      const response = await updateDescription(
        Number(currentRow?.key),
        editorData,
      );
      setEditorData('');
      console.log(response.result);
      message.success(response.msg);
    } catch (error) {
      message.error('Failed to update');
      console.error(error);
    } finally {
      handleDrawerClose();
    }
  };

  return (
    <>
      <Table
        className="flex-1"
        columns={productsColumns(handleEditClick)}
        dataSource={filteredData}
        scroll={{ x: 1200 }}
        pagination={customPaginationProps}
      />
      <Drawer
        title={<div className="text-2xl"> Edit Description</div>}
        width={500}
        onClose={handleDrawerClose}
        open={drawerVisible}
      >
        {currentRow && (
          <Form onFinish={handleFormSubmit}>
            <Form.Item>
              <CKEditor
                editor={ClassicEditor}
                data={currentRow.description}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setEditorData(data);
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="h-fit w-full rounded-full border-none bg-[#0995f7] px-3 py-2 text-[1.1rem] font-normal text-white"
              >
                Save
              </Button>
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </>
  );
}
