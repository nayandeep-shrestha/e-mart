import React, { ReactElement, ReactNode } from 'react';

const itemRender = (
  page: number,
  type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
  originalElement: ReactNode,
  totalPages: number,
  currentPage: number,
): React.ReactElement | null => {
  if (type === 'page') {
    if (
      page === 1 ||
      page === totalPages ||
      (page >= currentPage - 1 && page <= currentPage + 1)
    ) {
      return originalElement as ReactElement;
    }
    if (page === currentPage - 2 || page === currentPage + 2) {
      return <span>...</span>;
    }
    return null;
  }
  return originalElement as ReactElement;
};

export default itemRender;
