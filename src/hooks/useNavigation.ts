import { useState, useCallback } from 'react';

export type Page = 'inicio' | 'administracion' | 'perfil';

export function useNavigation() {
  const [currentPage, setCurrentPage] = useState<Page>('inicio');

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  return {
    currentPage,
    navigateTo
  };
}
