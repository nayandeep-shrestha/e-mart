'use client';

import React, { useRef, useContext, ChangeEvent } from 'react';
import { LogoContext, LogoContextProps } from '@/context/LogoContext';
import BannerSection from './BannerSection';
import Maintenance from './MaintenanceMode';
import LogoChange from './LogoChange';

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (typeof LogoContext === 'undefined') {
    throw new Error('LogoContext must be used within a LogoProvider');
  }

  const logoContext = useContext<LogoContextProps>(LogoContext);
  const { setLogo } = logoContext;

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setLogo(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative h-full overflow-hidden p-[2rem]">
      <Maintenance />
      <LogoChange
        fileRef={fileInputRef}
        handleButtonClick={handleButtonClick}
        handleFileChange={handleFileChange}
      />
      <BannerSection />
    </div>
  );
}
