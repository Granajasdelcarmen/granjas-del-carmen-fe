import React, { useState } from "react";
import {
  useRabbits,
  useRabbitsByGender,
  useRefetchRabbits,
} from "src/hooks/useRabbits";
import { RabbitsList } from "./RabbitsList";
import { RabbitCreateModal } from "./RabbitCreateModal";
import { AnimalSectionHeader } from "src/components/Common/AnimalSectionHeader";

export function RabbitsSection() {
  const [genderFilter, setGenderFilter] = useState<"ALL" | "MALE" | "FEMALE">(
    "ALL"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");
  const [discardedFilter, setDiscardedFilter] = useState<"active" | "discarded" | "all">("active");

  const sortByValue = sortOrder === "none" ? undefined : sortOrder;
  const discardedValue = discardedFilter === "active" ? false : discardedFilter === "discarded" ? true : null;
  
  const {
    data: allRabbits,
    isLoading: isLoadingAll,
    error: errorAll,
    isError: isErrorAll,
  } = useRabbits(sortByValue, discardedValue);
  
  const { data: maleRabbits, isLoading: isLoadingMale } =
    useRabbitsByGender("MALE", genderFilter === "MALE", sortByValue, discardedValue);
  const { data: femaleRabbits, isLoading: isLoadingFemale } =
    useRabbitsByGender("FEMALE", genderFilter === "FEMALE", sortByValue, discardedValue);

  const refetchRabbits = useRefetchRabbits();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const getCurrentData = () => {
    switch (genderFilter) {
      case "MALE":
        return { data: maleRabbits, isLoading: isLoadingMale };
      case "FEMALE":
        return { data: femaleRabbits, isLoading: isLoadingFemale };
      default:
        return { data: allRabbits, isLoading: isLoadingAll };
    }
  };

  const { data: rabbits, isLoading } = getCurrentData();
  const error = errorAll;
  const isError = isErrorAll;

  const handleRefetch = () => {
    refetchRabbits();
  };

  const getFilterCount = () => {
    switch (genderFilter) {
      case "MALE":
        return Array.isArray(maleRabbits) ? maleRabbits.length : 0;
      case "FEMALE":
        return Array.isArray(femaleRabbits) ? femaleRabbits.length : 0;
      default:
        return Array.isArray(allRabbits) ? allRabbits.length : 0;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <AnimalSectionHeader
        animalType="rabbit"
        animalTypeLabel="Conejos"
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
        createButtonLabel="Añadir conejo"
      />

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
            <RabbitsList rabbits={rabbits || []} isLoading={isLoading} />
            <RabbitCreateModal
              isOpen={isCreateOpen}
              onClose={() => setIsCreateOpen(false)}
            />
          </>
        )}
      </div>
    </div>
  );
}
