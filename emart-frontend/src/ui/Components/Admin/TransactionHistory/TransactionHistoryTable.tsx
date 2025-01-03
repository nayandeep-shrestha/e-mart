/* eslint-disable react/no-unstable-nested-components */
import { childColumns, parentColumns, subChildColumns } from '@/constants';
import {
  TransactionChildDataType,
  TransactionParentDataType,
  TransactionSubChildDataType,
} from '@/types';
import { Table } from 'antd';
import { useEffect, useState } from 'react';

export default function TransactionHistoryTable({
  filteredData,
}: {
  filteredData: TransactionParentDataType[];
}) {
  const [transactionData, setTransactionData] =
    useState<TransactionParentDataType[]>(filteredData);
  useEffect(() => {
    setTransactionData(filteredData);
  }, [filteredData]);
  // console.log(transactionData);
  // const parentData = transactionData.map(({ children, ...rest }) => rest);
  const expandedRowRender = (record: TransactionParentDataType) => {
    if (record.children) {
      return (
        <Table
          columns={childColumns}
          dataSource={record.children}
          pagination={false}
          bordered
          expandable={{
            expandedRowRender: (subRecord: TransactionChildDataType) => {
              if (subRecord.children) {
                console.log(subRecord.children);
                return (
                  <Table
                    columns={subChildColumns}
                    dataSource={subRecord.children}
                    pagination={false}
                    rowKey={(subChildRecord: TransactionSubChildDataType) =>
                      `sub-child-${subChildRecord.key}`
                    }
                    bordered
                  />
                );
              }
              return null;
            },
            rowExpandable: (subRecord: TransactionChildDataType) =>
              !!subRecord.children,
          }}
          rowKey={(childRecord: TransactionChildDataType) =>
            `child-${childRecord.key}`
          }
        />
      );
    }
    return null;
  };

  return (
    <Table
      columns={parentColumns}
      dataSource={transactionData}
      expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
      rowKey={(parentRecord: TransactionParentDataType) =>
        `parent-${parentRecord.key}`
      }
      scroll={{ x: 1200 }}
      bordered
    />
  );
}
