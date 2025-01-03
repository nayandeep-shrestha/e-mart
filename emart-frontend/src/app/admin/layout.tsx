'use client';

import { AuthContext } from '@/context';
import { SidebarCollapseProvider } from '@/context/SidebarCollapse';
import { redirect } from 'next/navigation';
import { useContext, useLayoutEffect } from 'react';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authContext = useContext(AuthContext);
  useLayoutEffect(() => {
    if (!authContext?.accessToken) {
      redirect('/');
    }
  }, [authContext?.accessToken]);
  return <SidebarCollapseProvider>{children}</SidebarCollapseProvider>;
}
