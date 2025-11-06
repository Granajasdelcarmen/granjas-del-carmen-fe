import React, { useState } from 'react';
import { Sheep } from 'src/types/api';
import { SheepCard } from './SheepCard';
import { SheepModal } from './SheepModal';
import { useAuth } from 'src/hooks/useAuth';

interface SheepListProps {
  sheep: Sheep[];
  isLoading?: boolean;
  onEditSheep?: (sheep: Sheep) => void;
  onDeleteSheep?: (sheepId: string) => void;
}

export function SheepList({ sheep, isLoading, onEditSheep, onDeleteSheep }: SheepListProps) {
  const [selectedSheep, setSelectedSheep] = useState<Sheep | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const handleViewSheep = (sheep: Sheep) => {
    setSelectedSheep(sheep);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSheep(null);
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

  if (!Array.isArray(sheep) || sheep.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🐑</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay ovejas</h3>
        <p className="text-gray-500">Agrega la primera oveja para comenzar</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.isArray(sheep) ? sheep.map((sheepItem) => (
          <SheepCard
            key={sheepItem.id}
            sheep={sheepItem}
            onEdit={onEditSheep}
            onDelete={onDeleteSheep}
            onView={handleViewSheep}
          />
        )) : null}
      </div>
      
      <SheepModal
        sheep={selectedSheep}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={onEditSheep}
        onDelete={onDeleteSheep}
        onDiscard={() => {
          // El hook ya invalida las queries, así que no necesitamos hacer nada aquí
        }}
        onSell={() => {
          // El hook ya invalida las queries, así que no necesitamos hacer nada aquí
        }}
        currentUserId={user?.sub}
      />
    </>
  );
}


