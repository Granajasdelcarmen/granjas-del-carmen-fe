import { useState } from 'react';
import { useTotalSales } from 'src/hooks/useTotalSales';
import { TotalSalesTable } from './TotalSalesTable';
import { SectionWrapper } from 'src/components/Common/SectionWrapper';
import { RefreshButton } from 'src/components/Common/RefreshButton';

export function TotalSalesSection() {
  const [sortBy, setSortBy] = useState<'asc' | 'desc' | undefined>('desc');

  const { data: salesData, isLoading, refetch } = useTotalSales(sortBy);
  const sales = Array.isArray(salesData) ? salesData : [];

  const totalSales = sales.reduce((sum, sale) => sum + sale.total_price, 0);
  const productSales = sales.filter(s => s.sale_type === 'product');
  const animalSales = sales.filter(s => s.sale_type === 'animal');

  return (
    <SectionWrapper
      title="Ventas Totales"
      description={`Total: ${sales.length} ventas | Productos: ${productSales.length} | Animales: ${animalSales.length} | Monto Total: $${totalSales.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
      actions={
        <>
          <RefreshButton onClick={() => refetch()} isLoading={isLoading} />
        </>
      }
    >
      <TotalSalesTable
        sales={sales}
        isLoading={isLoading}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
    </SectionWrapper>
  );
}

