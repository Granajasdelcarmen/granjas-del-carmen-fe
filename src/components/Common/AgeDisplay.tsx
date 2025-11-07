import React from 'react';
import { useAnimalAge } from 'src/hooks/useAnimalAge';
import { AnimalType } from 'src/types/api';

export interface AgeDisplayProps {
  birthDate?: string | null;
  animalType?: AnimalType;
  className?: string;
  label?: string;
}

/**
 * Componente reutilizable para mostrar la edad de un animal
 * Usa el hook useAnimalAge para calcular la edad de forma inteligente
 */
export function AgeDisplay({
  birthDate,
  animalType,
  className = '',
  label,
}: AgeDisplayProps) {
  const age = useAnimalAge(birthDate, animalType);

  if (label) {
    return (
      <div className={className}>
        <span className="font-medium">{label}:</span> {age}
      </div>
    );
  }

  return <span className={className}>{age}</span>;
}

