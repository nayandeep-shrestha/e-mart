'use client';

import { Layout } from 'antd';
import { AdminHeader, AdminSidebar } from '@/ui/Components';
import { useContext } from 'react';
import { SidebarCollapseContext } from '@/context/SidebarCollapse';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { Content } = Layout;
  const { collapse } = useContext(SidebarCollapseContext);
  return (
    <Layout
      className={`h-full w-full transition-all duration-200 ${collapse ? 'pl-0 sm:pl-[100px]' : 'sm:pl-[20rem]'}`}
    >
      <AdminSidebar />
      <Layout className="w-full">
        <AdminHeader />
        <Content className="overflow-y-auto p-2">{children}</Content>
      </Layout>
    </Layout>
  );
}
