import React, { ReactNode } from 'react';

interface DataListProps<T> {
  items: T[];
  isLoading?: boolean;
  renderItem: (item: T, index: number) => ReactNode;
  emptyState?: {
    icon: string;
    title: string;
    description: string;
  };
  gridCols?: string;
  loadingCount?: number;
}

export function DataList<T>({
  items,
  isLoading = false,
  renderItem,
  emptyState,
  gridCols = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  loadingCount = 12,
}: DataListProps<T>) {
  if (isLoading) {
    return (
      <div className={`grid ${gridCols} gap-3`}>
        {[...Array(loadingCount)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border p-3 animate-pulse"
          >
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                <div className="h-2 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    if (emptyState) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">{emptyState.icon}</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {emptyState.title}
          </h3>
          <p className="text-gray-500">{emptyState.description}</p>
        </div>
      );
    }
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay datos
        </h3>
        <p className="text-gray-500">No se encontraron elementos</p>
      </div>
    );
  }

  return <div className={`grid ${gridCols} gap-3`}>{items.map(renderItem)}</div>;
}

