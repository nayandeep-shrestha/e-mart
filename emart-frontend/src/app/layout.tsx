import type { Metadata } from 'next';
import { App as AntdApp } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import './globals.css';
import AntConfig from '@/ui/Components/Admin/ConfigProvider';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import LogoProvider from '@/context/LogoContext';
import AuthProvider from '@/context/auth/AuthProvider';

config.autoAddCss = false;

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AntdRegistry>
      <html lang="en">
        <body>
          <AntConfig>
            <AntdApp className="h-full">
              <AuthProvider>
                <LogoProvider>{children}</LogoProvider>
              </AuthProvider>
            </AntdApp>
          </AntConfig>
        </body>
      </html>
    </AntdRegistry>
  );
}