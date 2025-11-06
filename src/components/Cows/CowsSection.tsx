import React, { useState } from 'react';
import { useCows, useCowsByGender, useRefetchCows } from 'src/hooks/useCows';
import { CowsList } from './CowsList';
import { CowCreateModal } from './CowCreateModal';
import { AnimalSectionHeader } from 'src/components/Common/AnimalSectionHeader';

export function CowsSection() {
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'MALE' | 'FEMALE'>('ALL');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');
  const [discardedFilter, setDiscardedFilter] = useState<"active" | "discarded" | "all">("active");

  const sortByValue = sortOrder === "none" ? undefined : sortOrder;
  const discardedValue = discardedFilter === "active" ? false : discardedFilter === "discarded" ? true : null;
  
  const { data: allCows, isLoading: isLoadingAll, error: errorAll, isError: isErrorAll } = useCows(
    sortByValue, discardedValue
  );
  const { data: maleCows, isLoading: isLoadingMale } = useCowsByGender('MALE', genderFilter === 'MALE', sortByValue, discardedValue);
  const { data: femaleCows, isLoading: isLoadingFemale } = useCowsByGender('FEMALE', genderFilter === 'FEMALE', sortByValue, discardedValue);
  
  const refetchCows = useRefetchCows();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const getCurrentData = () => {
    switch (genderFilter) {
      case 'MALE':
        return { data: maleCows, isLoading: isLoadingMale };
      case 'FEMALE':
        return { data: femaleCows, isLoading: isLoadingFemale };
      default:
        return { data: allCows, isLoading: isLoadingAll };
    }
  };

  const { data: cows, isLoading } = getCurrentData();
  const error = errorAll;
  const isError = isErrorAll;

  const handleRefetch = () => {
    refetchCows();
  };

  const getFilterCount = () => {
    switch (genderFilter) {
      case 'MALE':
        return Array.isArray(maleCows) ? maleCows.length : 0;
      case 'FEMALE':
        return Array.isArray(femaleCows) ? femaleCows.length : 0;
      default:
        return Array.isArray(allCows) ? allCows.length : 0;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <AnimalSectionHeader
        animalType="cow"
        animalTypeLabel="Vacas"
        count={getFilterCount()}
        genderFilter={genderFilter}
        discardedFilter={discardedFilter}
        sortOrder={sortOrder}
        isLoading={isLoading}
        onGenderFilterChange={setGenderFilter}
        onDiscardedFilterChange={setDiscardedFilter}
        onSortOrderChange={setSortOrder}
        onRefetch={handleRefetch}
        onCreateClick={() => setIsCreateOpen(true)}
        createButtonLabel="Añadir vaca"
      />

      <div className="p-6">
        {isError ? (
          <div className="text-center py-8">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar vacas</h3>
            <p className="text-gray-500 mb-4">{error?.message || 'Error desconocido'}</p>
            <button
              onClick={handleRefetch}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <>
            <CowsList cows={cows || []} isLoading={isLoading} />
            <CowCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
          </>
        )}
      </div>
    </div>
  );
}


