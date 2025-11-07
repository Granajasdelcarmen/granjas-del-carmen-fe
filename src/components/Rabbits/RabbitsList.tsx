import React, { useState } from 'react';
import { Rabbit } from 'src/types/api';
import { RabbitModal } from './RabbitModal';
import { useAuth } from 'src/hooks/useAuth';
import { AgeDisplay } from 'src/components/Common/AgeDisplay';

interface RabbitsListProps {
  rabbits: Rabbit[];
  isLoading?: boolean;
  onEditRabbit?: (rabbit: Rabbit) => void;
  onDeleteRabbit?: (rabbitId: string) => void;
}

export const RabbitsList = React.memo(function RabbitsList({ rabbits, isLoading, onEditRabbit, onDeleteRabbit }: RabbitsListProps) {
  const [selectedRabbit, setSelectedRabbit] = useState<Rabbit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const currentUserId = user?.sub;

  const handleViewRabbit = (rabbit: Rabbit) => {
    setSelectedRabbit(rabbit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRabbit(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getGenderIcon = (gender?: string) => {
    switch (gender) {
      case 'MALE':
        return '♂️';
      case 'FEMALE':
        return '♀️';
      default:
        return '🐰';
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Género</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nacimiento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Género</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nacimiento</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edad</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rabbits.map((rabbit) => (
                  <tr 
                    key={rabbit.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleViewRabbit(rabbit)}
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {rabbit.image ? (
                          <img className="h-10 w-10 rounded-full object-cover mr-3" src={rabbit.image} alt={rabbit.name} />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-lg">{getGenderIcon(rabbit.gender)}</span>
                          </div>
                        )}
                        <div className="text-sm font-medium text-gray-900">{rabbit.name}</div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{getGenderIcon(rabbit.gender)} {rabbit.gender || 'N/A'}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">{formatDate(rabbit.birth_date)}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <AgeDisplay birthDate={rabbit.birth_date} animalType="RABBIT" />
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {rabbit.slaughtered ? (
                          <>
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                              🥩 Sacrificado
                            </span>
                            {rabbit.in_freezer && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                ❄️ En Congelador
                              </span>
                            )}
                            {rabbit.slaughtered_date && (
                              <span className="text-xs text-gray-500">
                                {formatDate(rabbit.slaughtered_date)}
                              </span>
                            )}
                          </>
                        ) : rabbit.discarded ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Descartado
                          </span>
                        ) : (
                          <>
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Activo
                            </span>
                            {rabbit.is_breeder && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                ⭐ Reproductor
                              </span>
                            )}
                            {!rabbit.is_breeder && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">
                                Venta
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {rabbits.map((rabbit) => (
          <div
            key={rabbit.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleViewRabbit(rabbit)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center flex-1 min-w-0">
                {rabbit.image ? (
                  <img className="h-12 w-12 rounded-full object-cover mr-3 flex-shrink-0" src={rabbit.image} alt={rabbit.name} />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-xl">{getGenderIcon(rabbit.gender)}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-gray-900 truncate">{rabbit.name}</h3>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>{getGenderIcon(rabbit.gender)} {rabbit.gender || 'N/A'}</span>
                    <span>•</span>
                    <span>{formatDate(rabbit.birth_date)}</span>
                    <span>•</span>
                    <AgeDisplay birthDate={rabbit.birth_date} animalType="RABBIT" className="text-xs" />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {rabbit.slaughtered ? (
                      <>
                        <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                          🥩 Sacrificado
                        </span>
                        {rabbit.in_freezer && (
                          <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            ❄️ En Congelador
                          </span>
                        )}
                      </>
                    ) : rabbit.discarded ? (
                      <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Descartado
                      </span>
                    ) : (
                      <>
                        <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Activo
                        </span>
                        {rabbit.is_breeder ? (
                          <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            ⭐ Reproductor
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                            Venta
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <RabbitModal
        rabbit={selectedRabbit}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={onEditRabbit}
        onDelete={onDeleteRabbit}
        onDiscard={() => {
          // El hook ya invalida las queries, así que no necesitamos hacer nada aquí
          // Pero podemos cerrar el modal si es necesario
        }}
        onSell={() => {
          // El hook ya invalida las queries, así que no necesitamos hacer nada aquí
        }}
        currentUserId={currentUserId}
      />
    </>
  );
});
