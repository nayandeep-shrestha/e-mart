'use client';

import React from 'react';
import { ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';

export default function AntConfig({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            collapsedIconSize: 20,
            iconSize: 22,
            darkItemBg: '#27374DFF',
            darkItemColor: '#ededed',
            darkItemHoverBg: '#3C4D6F',
            darkItemSelectedBg: '#3C4D6F',
            itemHeight: 55,
            itemMarginInline: 30,
          },
          Select: {
            optionFontSize: 18,
          },
          Layout: {
            bodyBg: 'white',
          },
          Table: {
            cellFontSize: 17,
            cellPaddingBlock: 20,
            cellPaddingInline: 20,
          },
        },
      }}
    >
      <StyleProvider hashPriority="high">{children}</StyleProvider>
    </ConfigProvider>
  );
}
