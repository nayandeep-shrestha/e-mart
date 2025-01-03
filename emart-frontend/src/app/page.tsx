'use client';

import { AuthContext } from '@/context';
import { LoginHeader, LoginFooter, LoginForm } from '@/ui/Components';
import { redirect } from 'next/navigation';
import { useContext, useLayoutEffect } from 'react';

export default function Home() {
  const authContext = useContext(AuthContext);
  useLayoutEffect(() => {
    if (authContext?.accessToken && authContext?.accessToken.length > 0) {
      redirect('/admin/orders');
    }
  }, [authContext?.accessToken]);

  return (
    <main className="relative mx-auto flex h-[100vh] w-[500px] max-w-full flex-col items-center justify-center px-[2rem]">
      <LoginHeader />
      <LoginForm />
      <LoginFooter />
    </main>
  );
}
