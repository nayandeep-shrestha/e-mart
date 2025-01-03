'use client';

import { LogoContext } from '@/context';
import { useContext } from 'react';
import Image from 'next/image';

export default function Logo({
  width,
  height,
  className,
}: {
  width: number;
  height: number;
  className: string;
}) {
  const logoContext = useContext(LogoContext);

  if (!logoContext) {
    throw new Error('LogoContext must be used within a LogoProvider');
  }

  const { logo } = logoContext;

  return (
    <Image
      src={logo ?? '/assets/logo.png'}
      alt="logo"
      className={className}
      width={width}
      height={height}
      priority
    />
  );
}
