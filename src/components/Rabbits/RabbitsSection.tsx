import React, { useState } from "react";
import {
  useRabbits,
  useRabbitsByGender,
  useRefetchRabbits,
} from "src/hooks/useRabbits";
import { RabbitsList } from "./RabbitsList";
import { RabbitCreateModal } from "./RabbitCreateModal";

export function RabbitsSection() {
  const [genderFilter, setGenderFilter] = useState<"ALL" | "MALE" | "FEMALE">(
    "ALL"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");

  const {
    data: allRabbits,
    isLoading: isLoadingAll,
    error: errorAll,
    isError: isErrorAll,
  } = useRabbits(sortOrder === "none" ? undefined : sortOrder);
  const { data: maleRabbits, isLoading: isLoadingMale } =
    useRabbitsByGender("MALE");
  const { data: femaleRabbits, isLoading: isLoadingFemale } =
    useRabbitsByGender("FEMALE");

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
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Conejos</h2>
            <p className="text-sm text-gray-500">
              Gestiona el inventario de conejos ({getFilterCount()}{" "}
              {genderFilter === "ALL" ? "total" : genderFilter.toLowerCase()})
            </p>
          </div>

          <div className="flex space-x-3">
            <label className="text-sm grid grid-rows">
              Genero
              <select
                value={genderFilter}
                onChange={(e) =>
                  setGenderFilter(e.target.value as "ALL" | "MALE" | "FEMALE")
                }
                className="px-1 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
              >
                <option value="ALL">Todos</option>
                <option value="MALE">Macho</option>
                <option value="FEMALE">Hembra</option>
              </select>
            </label>

            <label  className="text-sm grid grid-rows">
              Ordenar
      
                <select
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as "asc" | "desc" | "none")
                  }
                  className="px-1 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
                  title="Ordenar por fecha de nacimiento"
                >
                  <option value="none">Sin orden</option>
                  <option value="asc">Ascendente (nacimiento)</option>
                  <option value="desc">Descendente (nacimiento)</option>
                </select>
            </label>
            <button
              onClick={handleRefetch}
              disabled={isLoading}
              className="py-1 px-1 my-auto h-min bg-green-700 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={isLoading ? "Cargando..." : "Actualizar"}
              aria-label={isLoading ? "Cargando" : "Actualizar"}
            >
              {isLoading ? (
                "Cargando..."
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 transition-transform duration-300 hover:rotate-180"
                >
                  <path
                    d="M16.023 9.348h4.992V4.356"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.25 12a9.75 9.75 0 0 1 16.5-6.864"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.977 14.652H2.985v4.992"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21.75 12a9.75 9.75 0 0 1-16.5 6.864"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-2 py-2 my-auto h-min bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Añadir conejo
            </button>
          </div>
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
