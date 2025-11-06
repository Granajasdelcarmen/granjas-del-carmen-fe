import React, { useState } from 'react';
import { Modal } from 'src/components/Common/Modal';
import { useCreateCow } from 'src/hooks/useCows';

interface CowCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CowCreateModal({ isOpen, onClose }: CowCreateModalProps) {
  const createCow = useCreateCow();
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | ''>('');
  const [birthDate, setBirthDate] = useState('');

  const canSubmit = name.trim().length > 0 && (gender === 'MALE' || gender === 'FEMALE') && birthDate.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    createCow.mutate(
      {
        name,
        gender: gender as 'MALE' | 'FEMALE',
        birth_date: birthDate,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Añadir Vaca">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
            placeholder="Nombre de la vaca"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Género</label>
            <select
              required
              value={gender}
              onChange={(e) => setGender(e.target.value as 'MALE' | 'FEMALE' | '')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-h-[44px]"
            >
              <option value="">Selecciona</option>
              <option value="MALE">Macho</option>
              <option value="FEMALE">Hembra</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de nacimiento</label>
            <input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
            />
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
            disabled={!canSubmit || createCow.isPending}
            className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium min-h-[44px]"
          >
            {createCow.isPending ? 'Guardando...' : 'Crear'}
          </button>
        </div>
      </form>
    </Modal>
  );
}


