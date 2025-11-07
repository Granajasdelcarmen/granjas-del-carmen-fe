import React, { useState } from 'react';
import { Cow } from 'src/types/api';
import { CowCard } from './CowCard';
import { CowModal } from './CowModal';
import { useAuth } from 'src/hooks/useAuth';

interface CowsListProps {
  cows: Cow[];
  isLoading?: boolean;
  onEditCow?: (cow: Cow) => void;
  onDeleteCow?: (cowId: string) => void;
}

export const CowsList = React.memo(function CowsList({ cows, isLoading, onEditCow, onDeleteCow }: CowsListProps) {
  const [selectedCow, setSelectedCow] = useState<Cow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const handleViewCow = (cow: Cow) => {
    setSelectedCow(cow);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCow(null);
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

  if (!Array.isArray(cows) || cows.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🐄</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay vacas</h3>
        <p className="text-gray-500">Agrega la primera vaca para comenzar</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.isArray(cows) ? cows.map((cow) => (
          <CowCard
            key={cow.id}
            cow={cow}
            onEdit={onEditCow}
            onDelete={onDeleteCow}
            onView={handleViewCow}
          />
        )) : null}
      </div>
      
      <CowModal
        cow={selectedCow}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={onEditCow}
        onDelete={onDeleteCow}
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
});


