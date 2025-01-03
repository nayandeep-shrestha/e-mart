'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons/faArrowRightFromBracket';
import { CollapseType } from '@/types';
import { message } from 'antd';
import { axiosInstance } from '@/service/axiosInstance';
import { AuthContext } from '@/context';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';

export default function Logout({ collapse }: Pick<CollapseType, 'collapse'>) {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  return (
    <button
      type="button"
      className={`mx-auto flex items-center rounded-[0.5rem] bg-[#3C4D6F] px-[20px] py-[10px] text-[#ededed] ${collapse ? 'w-[60%]' : 'w-[85%]'}`}
      onClick={async () => {
        try {
          const response = await axiosInstance({
            method: 'POST',
            url: '/auth/logout',
          });
          message.success(response.data.msg);
          document.cookie = 'accessToken=; Max-Age=0; Path=/;';
          authContext?.setAccessToken(null);
          localStorage.removeItem('accessToken');
          router.push('/');
        } catch (error: any) {
          message.error(error.response?.data?.error || 'Logout failed');
        }
      }}
    >
      <FontAwesomeIcon
        icon={faArrowRightFromBracket}
        className=" h-[1.2rem] text-[#ededed]"
      />
      {collapse ? (
        ''
      ) : (
        <span className="ml-[1.5rem] text-[1.2rem] font-medium text-[#ededed] transition-all duration-300 sm:inline-flex">
          Logout
        </span>
      )}
    </button>
  );
}
