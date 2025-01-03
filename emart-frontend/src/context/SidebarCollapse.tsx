'use client';

import React, { createContext, useState, ReactNode, useMemo } from 'react';
import { CollapseType } from '@/types';

const defaultValue: CollapseType = {
  collapse: false,
  setCollapse: () => {},
};

export const SidebarCollapseContext = createContext<CollapseType>(defaultValue);

export function SidebarCollapseProvider({ children }: { children: ReactNode }) {
  const [collapse, setCollapse] = useState(false);
  const contextValue = useMemo(() => ({ collapse, setCollapse }), [collapse]);
  return (
    <SidebarCollapseContext.Provider value={contextValue}>
      {children}
    </SidebarCollapseContext.Provider>
  );
}
