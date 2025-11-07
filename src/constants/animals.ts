/**
 * Animal Species Constants
 * Centralized constants for animal species to ensure consistency across the application
 */
export const ANIMAL_SPECIES = {
  RABBIT: 'RABBIT',
  COW: 'COW',
  SHEEP: 'SHEEP',
} as const;

export type AnimalSpecies = typeof ANIMAL_SPECIES[keyof typeof ANIMAL_SPECIES];

/**
 * Animal species labels for UI display
 */
export const ANIMAL_SPECIES_LABELS: Record<AnimalSpecies, string> = {
  [ANIMAL_SPECIES.RABBIT]: 'Conejos',
  [ANIMAL_SPECIES.COW]: 'Vacas',
  [ANIMAL_SPECIES.SHEEP]: 'Ovejas',
};

/**
 * Animal species icons for UI display
 */
export const ANIMAL_SPECIES_ICONS: Record<AnimalSpecies, string> = {
  [ANIMAL_SPECIES.RABBIT]: '🐰',
  [ANIMAL_SPECIES.COW]: '🐄',
  [ANIMAL_SPECIES.SHEEP]: '🐑',
};

/**
 * Animal species singular labels
 */
export const ANIMAL_SPECIES_SINGULAR: Record<AnimalSpecies, string> = {
  [ANIMAL_SPECIES.RABBIT]: 'conejo',
  [ANIMAL_SPECIES.COW]: 'vaca',
  [ANIMAL_SPECIES.SHEEP]: 'oveja',
};

