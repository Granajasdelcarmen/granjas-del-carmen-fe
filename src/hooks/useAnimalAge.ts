import { useMemo } from 'react';
import { differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import { AnimalType } from 'src/types/api';
import { ANIMAL_SPECIES } from 'src/constants/animals';

/**
 * Hook para calcular la edad de un animal de forma inteligente
 * 
 * Reglas:
 * - Conejos: Siempre en días (negocio de corto tiempo, se sacrifican/venden dentro de 90 días)
 * - Ovejas, Vacas, Gallinas: 
 *   - Hasta 100 días: mostrar en días
 *   - Después de 100 días hasta 1 año: mostrar en meses
 *   - Después de 1 año: mostrar en años y meses (ej: "1 año y 4 meses")
 * 
 * @param birthDate - Fecha de nacimiento del animal
 * @param animalType - Tipo de animal (RABBIT, COW, SHEEP, CHICKEN, OTHER)
 * @returns Formato de edad calculado (ej: "45 días", "3 meses", "1 año y 4 meses")
 */
export function useAnimalAge(birthDate?: string | null, animalType?: AnimalType): string {
  return useMemo(() => {
    if (!birthDate) {
      return 'No disponible';
    }

    const birth = new Date(birthDate);
    const now = new Date();
    
    // Validar que la fecha de nacimiento sea válida
    if (isNaN(birth.getTime())) {
      return 'Fecha inválida';
    }

    // Para conejos: siempre en días
    if (animalType === ANIMAL_SPECIES.RABBIT) {
      const days = differenceInDays(now, birth);
      return `${days} ${days === 1 ? 'día' : 'días'}`;
    }

    // Para otros animales (ovejas, vacas, gallinas, otros):
    // - Hasta 100 días: mostrar en días
    // - Después de 100 días hasta 1 año: mostrar en meses
    // - Después de 1 año: mostrar en años y meses

    const days = differenceInDays(now, birth);
    
    if (days <= 100) {
      // Mostrar en días
      return `${days} ${days === 1 ? 'día' : 'días'}`;
    }

    const months = differenceInMonths(now, birth);
    
    if (months === 0) {
      // Menos de 1 mes pero más de 100 días (caso raro pero posible)
      return `${days} ${days === 1 ? 'día' : 'días'}`;
    }

    const years = differenceInYears(now, birth);

    if (years === 0) {
      // Menos de 1 año: mostrar solo meses
      return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    }

    // Más de 1 año: calcular meses restantes después de los años completos
    // Necesitamos calcular desde la fecha de nacimiento + años completos
    const birthPlusYears = new Date(birth);
    birthPlusYears.setFullYear(birth.getFullYear() + years);
    const remainingMonths = differenceInMonths(now, birthPlusYears);
    
    if (remainingMonths === 0) {
      // Exactamente años completos
      return `${years} ${years === 1 ? 'año' : 'años'}`;
    }

    // Años y meses
    const yearsText = `${years} ${years === 1 ? 'año' : 'años'}`;
    const monthsText = `${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`;
    return `${yearsText} y ${monthsText}`;
  }, [birthDate, animalType]);
}

