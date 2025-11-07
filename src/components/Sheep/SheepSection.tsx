import React, { useState, useMemo, useCallback } from 'react';
import { useAnimals, useAnimalsByGender, useRefetchAnimals } from 'src/hooks/useAnimals';
import { SheepList } from './SheepList';
import { SheepCreateModal } from './SheepCreateModal';
import { AnimalSectionHeader } from 'src/components/Common/AnimalSectionHeader';
import { ANIMAL_SPECIES } from 'src/constants/animals';

const SPECIES = ANIMAL_SPECIES.SHEEP;

export function SheepSection() {
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'MALE' | 'FEMALE'>('ALL');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');
  const [discardedFilter, setDiscardedFilter] = useState<"active" | "discarded" | "all">("active");

  const sortByValue = sortOrder === "none" ? undefined : sortOrder;
  const discardedValue = discardedFilter === "active" ? false : discardedFilter === "discarded" ? true : null;
  
  const { data: allSheep, isLoading: isLoadingAll, error: errorAll, isError: isErrorAll } = useAnimals(
    SPECIES, sortByValue, discardedValue
  );
  // Only fetch gender-specific data when that filter is active
  const { data: maleSheep, isLoading: isLoadingMale } = useAnimalsByGender(SPECIES, 'MALE', genderFilter === 'MALE', sortByValue, discardedValue);
  const { data: femaleSheep, isLoading: isLoadingFemale } = useAnimalsByGender(SPECIES, 'FEMALE', genderFilter === 'FEMALE', sortByValue, discardedValue);
  
  const refetchSheep = useRefetchAnimals(SPECIES);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Memoize current data calculation
  const { data: sheep, isLoading } = useMemo(() => {
    switch (genderFilter) {
      case 'MALE':
        return { data: maleSheep || [], isLoading: isLoadingMale };
      case 'FEMALE':
        return { data: femaleSheep || [], isLoading: isLoadingFemale };
      default:
        return { data: allSheep || [], isLoading: isLoadingAll };
    }
  }, [genderFilter, allSheep, maleSheep, femaleSheep, isLoadingAll, isLoadingMale, isLoadingFemale]);

  const error = errorAll;
  const isError = isErrorAll;

  const handleRefetch = useCallback(() => {
    refetchSheep();
  }, [refetchSheep]);

  // Memoize filter count calculation
  const filterCount = useMemo(() => {
    switch (genderFilter) {
      case 'MALE':
        return Array.isArray(maleSheep) ? maleSheep.length : 0;
      case 'FEMALE':
        return Array.isArray(femaleSheep) ? femaleSheep.length : 0;
      default:
        return Array.isArray(allSheep) ? allSheep.length : 0;
    }
  }, [genderFilter, allSheep, maleSheep, femaleSheep]);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <AnimalSectionHeader
        animalType="sheep"
        animalTypeLabel="Ovejas"
        count={filterCount}
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
            <SheepList sheep={sheep} isLoading={isLoading} />
            <SheepCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
          </>
        )}
      </div>
    </div>
  );
}


