import React, { useState } from 'react';
import { useSheep, useSheepByGender, useRefetchSheep } from 'src/hooks/useSheep';
import { SheepList } from './SheepList';
import { SheepCreateModal } from './SheepCreateModal';
import { AnimalSectionHeader } from 'src/components/Common/AnimalSectionHeader';

export function SheepSection() {
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'MALE' | 'FEMALE'>('ALL');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');
  const [discardedFilter, setDiscardedFilter] = useState<"active" | "discarded" | "all">("active");

  const sortByValue = sortOrder === "none" ? undefined : sortOrder;
  const discardedValue = discardedFilter === "active" ? false : discardedFilter === "discarded" ? true : null;
  
  const { data: allSheep, isLoading: isLoadingAll, error: errorAll, isError: isErrorAll } = useSheep(
    sortByValue, discardedValue
  );
  const { data: maleSheep, isLoading: isLoadingMale } = useSheepByGender('MALE', genderFilter === 'MALE', sortByValue, discardedValue);
  const { data: femaleSheep, isLoading: isLoadingFemale } = useSheepByGender('FEMALE', genderFilter === 'FEMALE', sortByValue, discardedValue);
  
  const refetchSheep = useRefetchSheep();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const getCurrentData = () => {
    switch (genderFilter) {
      case 'MALE':
        return { data: maleSheep, isLoading: isLoadingMale };
      case 'FEMALE':
        return { data: femaleSheep, isLoading: isLoadingFemale };
      default:
        return { data: allSheep, isLoading: isLoadingAll };
    }
  };

  const { data: sheep, isLoading } = getCurrentData();
  const error = errorAll;
  const isError = isErrorAll;

  const handleRefetch = () => {
    refetchSheep();
  };

  const getFilterCount = () => {
    switch (genderFilter) {
      case 'MALE':
        return Array.isArray(maleSheep) ? maleSheep.length : 0;
      case 'FEMALE':
        return Array.isArray(femaleSheep) ? femaleSheep.length : 0;
      default:
        return Array.isArray(allSheep) ? allSheep.length : 0;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <AnimalSectionHeader
        animalType="sheep"
        animalTypeLabel="Ovejas"
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
        createButtonLabel="Añadir oveja"
      />

      <div className="p-6">
        {isError ? (
          <div className="text-center py-8">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar ovejas</h3>
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
            <SheepList sheep={sheep || []} isLoading={isLoading} />
            <SheepCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
          </>
        )}
      </div>
    </div>
  );
}


