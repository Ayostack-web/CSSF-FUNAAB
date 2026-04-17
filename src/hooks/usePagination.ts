import { useState, useMemo } from 'react';

interface UsePaginationOptions {
  items: any[];
  itemsPerPage?: number;
}

export function usePagination({
  items,
  itemsPerPage = 10,
}: UsePaginationOptions) {
  const [currentPage, setCurrentPage] = useState(1);

  const { paginatedItems, totalPages, totalItems } = useMemo(() => {
    const total = items.length;
    const pages = Math.ceil(total / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = items.slice(startIndex, endIndex);

    return {
      paginatedItems: paginated,
      totalPages: pages,
      totalItems: total,
    };
  }, [items, itemsPerPage, currentPage]);

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const prevPage = () => {
    goToPage(currentPage - 1);
  };

  return {
    currentPage,
    totalPages,
    totalItems,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
  };
}
