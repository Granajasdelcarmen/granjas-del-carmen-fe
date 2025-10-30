import React, { useState } from 'react';
import { Modal } from 'src/components/Common/Modal';
import { useCreateRabbit } from 'src/hooks/useRabbits';

interface RabbitCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RabbitCreateModal({ isOpen, onClose }: RabbitCreateModalProps) {
  const createRabbit = useCreateRabbit();
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | ''>('');
  const [birthDate, setBirthDate] = useState('');

  const canSubmit = name.trim().length > 0 && (gender === 'MALE' || gender === 'FEMALE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    createRabbit.mutate(
      {
        name,
        gender: gender as 'MALE' | 'FEMALE',
        birth_date: birthDate || undefined,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Añadir Conejo">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre del conejo"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
            <select
              required
              value={gender}
              onChange={(e) => setGender(e.target.value as 'MALE' | 'FEMALE' | '')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona</option>
              <option value="MALE">Macho</option>
              <option value="FEMALE">Hembra</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
            <input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!canSubmit || createRabbit.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {createRabbit.isPending ? 'Guardando...' : 'Crear' }
          </button>
        </div>
      </form>
    </Modal>
  );
}


