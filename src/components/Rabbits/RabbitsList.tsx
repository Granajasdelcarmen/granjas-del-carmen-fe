import React, { useState } from 'react';
import { Rabbit } from 'src/types/api';
import { RabbitCard } from './RabbitCard';
import { RabbitModal } from './RabbitModal';

interface RabbitsListProps {
  rabbits: Rabbit[];
  isLoading?: boolean;
  onEditRabbit?: (rabbit: Rabbit) => void;
  onDeleteRabbit?: (rabbitId: string) => void;
}

export function RabbitsList({ rabbits, isLoading, onEditRabbit, onDeleteRabbit }: RabbitsListProps) {
  const [selectedRabbit, setSelectedRabbit] = useState<Rabbit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewRabbit = (rabbit: Rabbit) => {
    setSelectedRabbit(rabbit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRabbit(null);
  };
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-3 animate-pulse">
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

  if (!Array.isArray(rabbits) || rabbits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🐰</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay conejos</h3>
        <p className="text-gray-500">Agrega el primer conejo para comenzar</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.isArray(rabbits) ? rabbits.map((rabbit) => (
          <RabbitCard
            key={rabbit.id}
            rabbit={rabbit}
            onEdit={onEditRabbit}
            onDelete={onDeleteRabbit}
            onView={handleViewRabbit}
          />
        )) : null}
      </div>
      
      <RabbitModal
        rabbit={selectedRabbit}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={onEditRabbit}
        onDelete={onDeleteRabbit}
      />
    </>
  );
}
