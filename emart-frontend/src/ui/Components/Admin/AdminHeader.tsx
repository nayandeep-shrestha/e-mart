'use client';

import { Layout } from 'antd';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import Image from 'next/image';
import Link from 'next/link';
import SidebarMenuItems from '@/constants/menuItems';
import { useCallback, useContext, useEffect, useState } from 'react';
import { SidebarCollapseContext } from '@/context/SidebarCollapse';
import { axiosInstance } from '@/service/axiosInstance';

export default function AdminHeader() {
  const { collapse, setCollapse } = useContext(SidebarCollapseContext);
  const [userEmail, setUserEmail] = useState();
  const { Header } = Layout;
  const pathname = usePathname();
  const currentItem = SidebarMenuItems.find(
    (item) => item.key === pathname.split('/').pop(),
  );
  const handleCLick = () => {
    setCollapse(!collapse);
  };

  const fetchProfile = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/auth/profile');
      setUserEmail(response.data.result.email);
    } catch (error) {
      console.error(error);
    }
  }, []);
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <Header
      style={{ background: 'white' }}
      className="shadow-sm flex h-[5rem] items-center justify-between border bg-white px-[2rem]"
    >
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faBars}
          className="cursor-pointer text-[1.5rem]"
          onClick={handleCLick}
        />
        {currentItem && (
          <span className="ml-5 text-[25px] font-bold">
            {currentItem?.label}
          </span>
        )}
      </div>

      <div className="flex items-center">
        <p className="hidden text-[1rem] md:block">{userEmail}</p>
        <Image
          src="/assets/avatar.png"
          alt="Avatar"
          width={50}
          height={50}
          className="ml-4 rounded-full p-1 ring-1 ring-gray-400 "
        />
        <Link
          href="/"
          className="relative mx-4 rounded-full p-3 transition-all hover:bg-slate-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            className="h-6 w-6 stroke-gray-900"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>
        </Link>
      </div>
    </Header>
  );
}
