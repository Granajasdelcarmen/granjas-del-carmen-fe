import React, { useState } from 'react';
import { useRabbits, useRabbitsByGender, useRefetchRabbits } from 'src/hooks/useRabbits';
import { RabbitsList } from './RabbitsList';

export function RabbitsSection() {
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'MALE' | 'FEMALE'>('ALL');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');
  
  const { data: allRabbits, isLoading: isLoadingAll, error: errorAll, isError: isErrorAll } = useRabbits(
    sortOrder === 'none' ? undefined : sortOrder
  );
  const { data: maleRabbits, isLoading: isLoadingMale } = useRabbitsByGender('MALE');
  const { data: femaleRabbits, isLoading: isLoadingFemale } = useRabbitsByGender('FEMALE');
  
  const refetchRabbits = useRefetchRabbits();

  const getCurrentData = () => {
    switch (genderFilter) {
      case 'MALE':
        return { data: maleRabbits, isLoading: isLoadingMale };
      case 'FEMALE':
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
      case 'MALE':
        return Array.isArray(maleRabbits) ? maleRabbits.length : 0;
      case 'FEMALE':
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
              Gestiona el inventario de conejos ({getFilterCount()} {genderFilter === 'ALL' ? 'total' : genderFilter.toLowerCase()})
            </p>
          </div>
          
          <div className="flex space-x-3">
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as 'ALL' | 'MALE' | 'FEMALE')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">Todos</option>
              <option value="MALE">Macho</option>
              <option value="FEMALE">Hembra</option>
            </select>

            {genderFilter === 'ALL' && (
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | 'none')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title="Ordenar por fecha de nacimiento"
              >
                <option value="none">Sin orden</option>
                <option value="asc">Ascendente (nacimiento)</option>
                <option value="desc">Descendente (nacimiento)</option>
              </select>
            )}
            
            <button
              onClick={handleRefetch}
              disabled={isLoading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isError ? (
          <div className="text-center py-8">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar conejos</h3>
            <p className="text-gray-500 mb-4">{error?.message || 'Error desconocido'}</p>
            <button
              onClick={handleRefetch}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <RabbitsList rabbits={rabbits || []} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
