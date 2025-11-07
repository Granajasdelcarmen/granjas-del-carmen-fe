import React, { useState } from 'react';
import { Modal } from 'src/components/Common/Modal';
import { useCreateAnimal, useAnimals } from 'src/hooks/useAnimals';
import { AnimalOrigin } from 'src/types/api';
import { ANIMAL_SPECIES } from 'src/constants/animals';

const SPECIES = ANIMAL_SPECIES.COW;

interface CowCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CowCreateModal({ isOpen, onClose }: CowCreateModalProps) {
  const createCow = useCreateAnimal(SPECIES);
  const { data: cows = [] } = useAnimals(SPECIES, undefined, false); // Get active cows for parent selection
  
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | ''>('');
  const [birthDate, setBirthDate] = useState('');
  const [origin, setOrigin] = useState<AnimalOrigin>('PURCHASED');
  
  // Parent fields (for BORN origin)
  const [motherId, setMotherId] = useState('');
  const [fatherId, setFatherId] = useState('');
  
  // Purchase fields (for PURCHASED origin)
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseVendor, setPurchaseVendor] = useState('');

  // Filter cows by gender for parent selection
  const femaleCows = cows.filter(cow => cow.gender === 'FEMALE' && !cow.discarded);
  const maleCows = cows.filter(cow => cow.gender === 'MALE' && !cow.discarded);

  const canSubmit = name.trim().length > 0 && 
    (gender === 'MALE' || gender === 'FEMALE') && 
    (origin === 'PURCHASED' || (origin === 'BORN' && birthDate.trim().length > 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    const cowData: any = {
      name,
      gender: gender as 'MALE' | 'FEMALE',
      origin,
    };

    if (origin === 'BORN') {
      cowData.birth_date = birthDate;
      if (motherId) cowData.mother_id = motherId;
      if (fatherId) cowData.father_id = fatherId;
    } else {
      if (purchaseDate) cowData.purchase_date = purchaseDate;
      if (purchasePrice) cowData.purchase_price = parseFloat(purchasePrice);
      if (purchaseVendor) cowData.purchase_vendor = purchaseVendor;
      if (birthDate) cowData.birth_date = birthDate; // Birth date can still be set for purchased animals
    }

    createCow.mutate(cowData, {
      onSuccess: () => {
        // Reset form
        setName('');
        setGender('');
        setBirthDate('');
        setOrigin('PURCHASED');
        setMotherId('');
        setFatherId('');
        setPurchaseDate('');
        setPurchasePrice('');
        setPurchaseVendor('');
        onClose();
      },
    });
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
            required
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Origen</label>
            <select
              required
              value={origin}
              onChange={(e) => setOrigin(e.target.value as AnimalOrigin)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-h-[44px]"
            >
              <option value="PURCHASED">Comprado</option>
              <option value="BORN">Nacido en la granja</option>
            </select>
          </div>
        </div>

        {origin === 'BORN' ? (
          <>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Madre (opcional)</label>
                <select
                  value={motherId}
                  onChange={(e) => setMotherId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-h-[44px]"
                >
                  <option value="">Selecciona una vaca</option>
                  {femaleCows.map(cow => (
                    <option key={cow.id} value={cow.id}>{cow.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Padre (opcional)</label>
                <select
                  value={fatherId}
                  onChange={(e) => setFatherId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-h-[44px]"
                >
                  <option value="">Selecciona un toro</option>
                  {maleCows.map(cow => (
                    <option key={cow.id} value={cow.id}>{cow.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de nacimiento (opcional)</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de compra (opcional)</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Precio de compra (opcional)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Vendedor/Proveedor (opcional)</label>
                <input
                  type="text"
                  value={purchaseVendor}
                  onChange={(e) => setPurchaseVendor(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
                  placeholder="Nombre del vendedor"
                />
              </div>
            </div>
          </>
        )}

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
