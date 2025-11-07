import React, { useState } from 'react';
import { Modal } from 'src/components/Common/Modal';
import { useCreateRabbitLitter } from 'src/hooks/useRabbits';
import { useAnimals } from 'src/hooks/useAnimals';
import { ANIMAL_SPECIES } from 'src/constants/animals';

const SPECIES = ANIMAL_SPECIES.RABBIT;

interface RabbitLitterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RabbitLitterModal({ isOpen, onClose }: RabbitLitterModalProps) {
  const createLitter = useCreateRabbitLitter();
  const { data: rabbits = [] } = useAnimals(SPECIES, undefined, false); // Get active rabbits for parent selection
  
  const [motherId, setMotherId] = useState('');
  const [fatherId, setFatherId] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [liveCount, setLiveCount] = useState('');
  const [deadCount, setDeadCount] = useState('');
  const [namePrefix, setNamePrefix] = useState('Conejo');
  const [deadNotes, setDeadNotes] = useState('');
  const [deadSuspectedCause, setDeadSuspectedCause] = useState('');

  // Filter rabbits by gender and breeder status for parent selection
  // Only show breeders (is_breeder = true) as they are the ones used for reproduction
  const femaleRabbits = rabbits.filter(rabbit => 
    rabbit.gender === 'FEMALE' && 
    !rabbit.discarded && 
    rabbit.is_breeder === true
  );
  const maleRabbits = rabbits.filter(rabbit => 
    rabbit.gender === 'MALE' && 
    !rabbit.discarded && 
    rabbit.is_breeder === true
  );

  const canSubmit = motherId.trim().length > 0 && 
    birthDate.trim().length > 0 && 
    liveCount.trim().length > 0 && 
    parseInt(liveCount) > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    const litterData: any = {
      mother_id: motherId,
      birth_date: birthDate,
      count: parseInt(liveCount),
      name_prefix: namePrefix || 'Conejo',
    };

    if (fatherId) {
      litterData.father_id = fatherId;
    }

    // Add dead offspring info if provided
    const deadCountNum = parseInt(deadCount) || 0;
    if (deadCountNum > 0) {
      litterData.dead_count = deadCountNum;
      if (deadNotes) {
        litterData.dead_notes = deadNotes;
      }
      if (deadSuspectedCause) {
        litterData.dead_suspected_cause = deadSuspectedCause;
      }
    }

    createLitter.mutate(litterData, {
      onSuccess: () => {
        // Reset form
        setMotherId('');
        setFatherId('');
        setBirthDate('');
        setLiveCount('');
        setDeadCount('');
        setNamePrefix('Conejo');
        setDeadNotes('');
        setDeadSuspectedCause('');
        onClose();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Camada de Conejos">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Puedes registrar conejos vivos y muertos en una sola operación. 
            Por ejemplo: 10 vivos y 1 muerto.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Madre *</label>
            <select
              required
              value={motherId}
              onChange={(e) => setMotherId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-h-[44px]"
            >
              <option value="">Selecciona una coneja reproductora</option>
              {femaleRabbits.length === 0 ? (
                <option value="" disabled>No hay conejas reproductoras disponibles</option>
              ) : (
                femaleRabbits.map(rabbit => (
                  <option key={rabbit.id} value={rabbit.id}>
                    {rabbit.name} ⭐
                  </option>
                ))
              )}
            </select>
            {femaleRabbits.length === 0 && (
              <p className="text-xs text-yellow-600 mt-1">
                ⚠️ No hay conejas marcadas como reproductoras. Marca algunas conejas como reproductoras para poder crear camadas.
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Padre (opcional)</label>
            <select
              value={fatherId}
              onChange={(e) => setFatherId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-h-[44px]"
            >
              <option value="">Selecciona un conejo reproductor (opcional)</option>
              {maleRabbits.length === 0 ? (
                <option value="" disabled>No hay conejos reproductores disponibles</option>
              ) : (
                maleRabbits.map(rabbit => (
                  <option key={rabbit.id} value={rabbit.id}>
                    {rabbit.name} ⭐
                  </option>
                ))
              )}
            </select>
            {maleRabbits.length === 0 && (
              <p className="text-xs text-yellow-600 mt-1">
                ⚠️ No hay conejos marcados como reproductores. Marca algunos conejos como reproductores para poder seleccionarlos.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Nacimiento *</label>
            <input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Prefijo de Nombre</label>
            <input
              type="text"
              value={namePrefix}
              onChange={(e) => setNamePrefix(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
              placeholder="Conejo"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Conejos Vivos</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cantidad de Conejos Vivos *</label>
            <input
              type="number"
              required
              min="1"
              max="20"
              value={liveCount}
              onChange={(e) => setLiveCount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
              placeholder="Ej: 10"
            />
            <p className="text-xs text-gray-500 mt-1">Rango típico: 5-12 conejos por camada</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Conejos Muertos (Opcional)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cantidad de Conejos Muertos</label>
              <input
                type="number"
                min="0"
                max="20"
                value={deadCount}
                onChange={(e) => setDeadCount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">Deja en 0 si no hay crías muertas</p>
            </div>

            {parseInt(deadCount) > 0 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Causa Sospechada (opcional)</label>
                  <select
                    value={deadSuspectedCause}
                    onChange={(e) => setDeadSuspectedCause(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-h-[44px]"
                  >
                    <option value="">Selecciona una causa</option>
                    <option value="enfermedad">Enfermedad</option>
                    <option value="déficit vitamínico">Déficit Vitamínico</option>
                    <option value="alimento">Problema con Alimento</option>
                    <option value="temperatura">Temperatura</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Notas Adicionales (opcional)</label>
                  <textarea
                    value={deadNotes}
                    onChange={(e) => setDeadNotes(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Observaciones sobre las crías muertas..."
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            className="px-4 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium min-h-[44px]"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!canSubmit || createLitter.isPending}
            className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium min-h-[44px]"
          >
            {createLitter.isPending ? 'Registrando...' : 'Registrar Camada'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

