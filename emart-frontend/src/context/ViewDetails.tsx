'use client';

import React, { createContext, useState, ReactNode, useMemo } from 'react';
import { CollapseType } from '@/types';

const defaultValue: CollapseType = {
  collapse: true,
  setCollapse: () => {},
};

export const ViewDetailsContext = createContext<CollapseType>(defaultValue);

export function ViewDetailsProvider({ children }: { children: ReactNode }) {
  const [collapse, setCollapse] = useState(true);
  const contextValue = useMemo(() => ({ collapse, setCollapse }), [collapse]);
  return (
    <ViewDetailsContext.Provider value={contextValue}>
      {children}
    </ViewDetailsContext.Provider>
  );
}
