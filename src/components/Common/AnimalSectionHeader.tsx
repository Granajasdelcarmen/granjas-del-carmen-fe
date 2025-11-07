import React from 'react';

export type AnimalType = 'rabbit' | 'cow' | 'sheep';
export type GenderFilter = 'ALL' | 'MALE' | 'FEMALE';
export type DiscardedFilter = 'active' | 'discarded' | 'all';
export type SortOrder = 'asc' | 'desc' | 'none';

interface AnimalSectionHeaderProps {
  animalType: AnimalType;
  animalTypeLabel: string; // "Conejos", "Vacas", "Ovejas"
  count: number;
  genderFilter: GenderFilter;
  discardedFilter: DiscardedFilter;
  sortOrder: SortOrder;
  isLoading: boolean;
  onGenderFilterChange: (filter: GenderFilter) => void;
  onDiscardedFilterChange: (filter: DiscardedFilter) => void;
  onSortOrderChange: (order: SortOrder) => void;
  onRefetch: () => void;
  onCreateClick: () => void;
  createButtonLabel: string; // "Añadir conejo", "Añadir vaca", etc.
  extraButtons?: React.ReactNode; // Botones adicionales (opcional)
}

const animalConfig: Record<AnimalType, { icon: string; singular: string }> = {
  rabbit: { icon: '🐰', singular: 'conejo' },
  cow: { icon: '🐄', singular: 'vaca' },
  sheep: { icon: '🐑', singular: 'oveja' },
};

export function AnimalSectionHeader({
  animalType,
  animalTypeLabel,
  count,
  genderFilter,
  discardedFilter,
  sortOrder,
  isLoading,
  onGenderFilterChange,
  onDiscardedFilterChange,
  onSortOrderChange,
  onRefetch,
  onCreateClick,
  createButtonLabel,
  extraButtons,
}: AnimalSectionHeaderProps) {
  const config = animalConfig[animalType];

  return (
    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 space-y-4">
      {/* Primera fila: Título y descripción */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            <span className="mr-2">{config.icon}</span>
            {animalTypeLabel}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Gestiona el inventario de {animalTypeLabel.toLowerCase()} ({count}{' '}
            {genderFilter === 'ALL' ? 'total' : genderFilter.toLowerCase()})
          </p>
        </div>
      </div>

      {/* Segunda fila: Filtros y acciones */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-end">
        {/* Filtros en grid responsive */}
        <div className="grid grid-cols-3 gap-2 flex-1">
          <label className="flex flex-col">
            <span className="text-xs text-gray-600 mb-1">Género</span>
            <select
              value={genderFilter}
              onChange={(e) =>
                onGenderFilterChange(e.target.value as GenderFilter)
              }
              className="text-sm px-2.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="ALL">Todos</option>
              <option value="MALE">Macho</option>
              <option value="FEMALE">Hembra</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-gray-600 mb-1">Estado</span>
            <select
              value={discardedFilter}
              onChange={(e) =>
                onDiscardedFilterChange(e.target.value as DiscardedFilter)
              }
              className="text-sm px-2.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              title="Filtrar por estado del animal"
            >
              <option value="active">Vivos</option>
              <option value="discarded">Descartados</option>
              <option value="all">Todos</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-gray-600 mb-1">Ordenar</span>
            <select
              value={sortOrder}
              onChange={(e) =>
                onSortOrderChange(e.target.value as SortOrder)
              }
              className="text-sm px-2.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              title="Ordenar por fecha de nacimiento"
            >
              <option value="none">Sin orden</option>
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </label>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={onRefetch}
            disabled={isLoading}
            className="flex-shrink-0 p-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            title={isLoading ? 'Cargando...' : 'Actualizar'}
            aria-label={isLoading ? 'Cargando' : 'Actualizar'}
          >
            {isLoading ? (
              <span className="text-sm">...</span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5 transition-transform duration-300"
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

          {extraButtons}

          <button
            onClick={onCreateClick}
            className="px-3 sm:px-4 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors min-h-[44px] whitespace-nowrap"
          >
            <span className="hidden sm:inline">{createButtonLabel}</span>
            <span className="sm:hidden">+ Añadir</span>
          </button>
        </div>
      </div>
    </div>
  );
}

