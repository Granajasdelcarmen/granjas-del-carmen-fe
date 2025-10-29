import React from 'react';
import { Rabbit } from 'src/types/api';
import { RabbitCard } from './RabbitCard';

interface RabbitsListProps {
  rabbits: Rabbit[];
  isLoading?: boolean;
  onEditRabbit?: (rabbit: Rabbit) => void;
  onDeleteRabbit?: (rabbitId: string) => void;
}

export function RabbitsList({ rabbits, isLoading, onEditRabbit, onDeleteRabbit }: RabbitsListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (rabbits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🐰</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay conejos</h3>
        <p className="text-gray-500">Agrega el primer conejo para comenzar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rabbits.map((rabbit) => (
        <RabbitCard
          key={rabbit.id}
          rabbit={rabbit}
          onEdit={onEditRabbit}
          onDelete={onDeleteRabbit}
        />
      ))}
    </div>
  );
}
