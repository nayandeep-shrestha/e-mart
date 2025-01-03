'use client';

import React, { createContext, useState, ReactNode, useMemo } from 'react';

export interface LogoContextProps {
  logo: string | null;
  setLogo: (logo: string | null) => void;
}
const defaultValue: LogoContextProps = {
  logo: null,
  setLogo: () => {},
};

export const LogoContext = createContext<LogoContextProps>(defaultValue);

export default function LogoProvider({ children }: { children: ReactNode }) {
  const [logo, setLogo] = useState<string | null>(null);

  const contextValue = useMemo(() => ({ logo, setLogo }), [logo]);

  return (
    <LogoContext.Provider value={contextValue}>{children}</LogoContext.Provider>
  );
}
