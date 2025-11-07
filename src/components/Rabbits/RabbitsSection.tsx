import React, { useState, useMemo, useCallback } from "react";
import {
  useAnimals,
  useAnimalsByGender,
  useRefetchAnimals,
} from "src/hooks/useAnimals";
import { useCreateRabbitLitter } from "src/hooks/useRabbits";
import { RabbitsList } from "./RabbitsList";
import { RabbitCreateModal } from "./RabbitCreateModal";
import { RabbitLitterModal } from "./RabbitLitterModal";
import { AnimalSectionHeader } from "src/components/Common/AnimalSectionHeader";
import { ANIMAL_SPECIES } from "src/constants/animals";

const SPECIES = ANIMAL_SPECIES.RABBIT;

export function RabbitsSection() {
  const [genderFilter, setGenderFilter] = useState<"ALL" | "MALE" | "FEMALE">(
    "ALL"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");
  const [discardedFilter, setDiscardedFilter] = useState<"active" | "discarded" | "all">("active");
  const [breederFilter, setBreederFilter] = useState<"ALL" | "BREEDER" | "NON_BREEDER">("ALL");
  const [freezerFilter, setFreezerFilter] = useState<"ALL" | "IN_FREEZER" | "NOT_IN_FREEZER">("ALL");

  const sortByValue = sortOrder === "none" ? undefined : sortOrder;
  const discardedValue = discardedFilter === "active" ? false : discardedFilter === "discarded" ? true : null;
  
  // Only fetch all rabbits when needed
  const {
    data: allRabbits,
    isLoading: isLoadingAll,
    error: errorAll,
    isError: isErrorAll,
  } = useAnimals(SPECIES, sortByValue, discardedValue);
  
  // Only fetch gender-specific data when that filter is active
  const { data: maleRabbits, isLoading: isLoadingMale } =
    useAnimalsByGender(SPECIES, "MALE", genderFilter === "MALE", sortByValue, discardedValue);
  const { data: femaleRabbits, isLoading: isLoadingFemale } =
    useAnimalsByGender(SPECIES, "FEMALE", genderFilter === "FEMALE", sortByValue, discardedValue);

  const refetchRabbits = useRefetchAnimals(SPECIES);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLitterOpen, setIsLitterOpen] = useState(false);

  // Memoize current data calculation
  const { data: rabbits, isLoading } = useMemo(() => {
    let data;
    let isLoading;
    
    switch (genderFilter) {
      case "MALE":
        data = maleRabbits;
        isLoading = isLoadingMale;
        break;
      case "FEMALE":
        data = femaleRabbits;
        isLoading = isLoadingFemale;
        break;
      default:
        data = allRabbits;
        isLoading = isLoadingAll;
    }

    // Aplicar filtro de reproductor
    if (breederFilter !== "ALL" && Array.isArray(data)) {
      data = data.filter(rabbit => 
        breederFilter === "BREEDER" ? rabbit.is_breeder === true : rabbit.is_breeder !== true
      );
    }

    // Aplicar filtro de congelador
    if (freezerFilter !== "ALL" && Array.isArray(data)) {
      data = data.filter(rabbit => 
        freezerFilter === "IN_FREEZER" ? rabbit.in_freezer === true : rabbit.in_freezer !== true
      );
    }

    return { data: data || [], isLoading };
  }, [genderFilter, breederFilter, freezerFilter, allRabbits, maleRabbits, femaleRabbits, isLoadingAll, isLoadingMale, isLoadingFemale]);

  const error = errorAll;
  const isError = isErrorAll;

  const handleRefetch = useCallback(() => {
    refetchRabbits();
  }, [refetchRabbits]);

  // Memoize filter count calculation
  const filterCount = useMemo(() => {
    let count = 0;
    switch (genderFilter) {
      case "MALE":
        count = Array.isArray(maleRabbits) ? maleRabbits.length : 0;
        break;
      case "FEMALE":
        count = Array.isArray(femaleRabbits) ? femaleRabbits.length : 0;
        break;
      default:
        count = Array.isArray(allRabbits) ? allRabbits.length : 0;
    }

    // Aplicar filtro de reproductor al conteo
    if (breederFilter !== "ALL" && Array.isArray(allRabbits)) {
      const filtered = allRabbits.filter(rabbit => 
        breederFilter === "BREEDER" ? rabbit.is_breeder === true : rabbit.is_breeder !== true
      );
      count = filtered.length;
    }

    return count;
  }, [genderFilter, breederFilter, allRabbits, maleRabbits, femaleRabbits]);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <AnimalSectionHeader
        animalType="rabbit"
        animalTypeLabel="Conejos"
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
        createButtonLabel="Añadir conejo"
        extraButtons={
          <button
            onClick={() => setIsLitterOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium min-h-[44px] flex items-center space-x-2"
          >
            <span>🐰</span>
            <span>Registrar Camada</span>
          </button>
        }
      />

      {/* Filtros adicionales */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Reproductor:</span>
            <select
              value={breederFilter}
              onChange={(e) => setBreederFilter(e.target.value as "ALL" | "BREEDER" | "NON_BREEDER")}
              className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="ALL">Todos</option>
              <option value="BREEDER">⭐ Reproductores</option>
              <option value="NON_BREEDER">Venta</option>
            </select>
          </label>
          <label className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Congelador:</span>
            <select
              value={freezerFilter}
              onChange={(e) => setFreezerFilter(e.target.value as "ALL" | "IN_FREEZER" | "NOT_IN_FREEZER")}
              className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="ALL">Todos</option>
              <option value="IN_FREEZER">❄️ En Congelador</option>
              <option value="NOT_IN_FREEZER">No en Congelador</option>
            </select>
          </label>
        </div>
      </div>

      <div className="p-6">
        {isError ? (
          <div className="text-center py-8">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error al cargar conejos
            </h3>
            <p className="text-gray-500 mb-4">
              {error?.message || "Error desconocido"}
            </p>
            <button
              onClick={handleRefetch}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <>
            <RabbitsList rabbits={rabbits} isLoading={isLoading} />
            <RabbitCreateModal
              isOpen={isCreateOpen}
              onClose={() => setIsCreateOpen(false)}
            />
            <RabbitLitterModal
              isOpen={isLitterOpen}
              onClose={() => setIsLitterOpen(false)}
            />
          </>
        )}
      </div>
    </div>
  );
}
