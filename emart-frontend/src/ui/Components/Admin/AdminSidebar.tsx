'use client';

import { Layout, Menu } from 'antd';
import SidebarMenuItems from '@/constants/menuItems';
import { Logo } from '@/ui/Molecules';
import { Logout } from '@/ui/Atoms';
import { useContext } from 'react';
import { SidebarCollapseContext } from '@/context/SidebarCollapse';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const { Sider } = Layout;
  const router = useRouter();
  const pathname = usePathname();
  const { collapse } = useContext(SidebarCollapseContext);

  return (
    <Sider
      collapsible
      trigger={null}
      collapsed={collapse}
      style={{
        display: 'flex',
        flexDirection: 'column',
        top: '0',
        bottom: '0',
        height: '100vh',
        background: '#27374DFF',
        position: 'fixed',
        zIndex: 50,
      }}
      width="20rem"
      collapsedWidth={120}
      className={`left-0 sm:bottom-0 sm:left-0 sm:top-0 ${collapse ? 'left-0' : 'left-[-30rem]'}`}
    >
      <div className="xs:justify-between flex h-[8rem] flex-col items-center justify-center gap-4">
        <Logo
          width={collapse ? 60 : 80}
          height={collapse ? 60 : 80}
          className="rounded-lg object-cover duration-200 bg-white p-1"
        />
      </div>

      <Menu
        mode="inline"
        theme="dark"
        style={{
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 10rem)',
        }}
        items={SidebarMenuItems}
        onClick={(e) => router.push(`/admin/${e.key}`)}
        defaultSelectedKeys={[pathname.split('/').pop()!]}
        className="font-medium custom-scrollbar"
      />
      <Logout collapse={collapse} />
    </Sider>
  );
}
