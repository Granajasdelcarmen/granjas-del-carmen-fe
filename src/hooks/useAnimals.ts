import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { animalService } from 'src/services/animalService';
import { BaseAnimal, BaseAnimalCreate, BaseAnimalUpdate } from 'src/types/api';
import { AnimalSpecies, ANIMAL_SPECIES } from 'src/constants/animals';
import { logger } from 'src/utils/logger';

// Query keys factory
export const animalKeys = {
  all: (species: AnimalSpecies) => ['animals', species] as const,
  lists: (species: AnimalSpecies) => [...animalKeys.all(species), 'list'] as const,
  list: (species: AnimalSpecies, filters: string) => 
    [...animalKeys.lists(species), { filters }] as const,
  sorted: (species: AnimalSpecies, order: 'asc' | 'desc' | undefined, discarded?: boolean | null) => 
    [...animalKeys.lists(species), 'sorted', order ?? 'none', 'discarded', discarded ?? false] as const,
  details: (species: AnimalSpecies) => [...animalKeys.all(species), 'detail'] as const,
  detail: (species: AnimalSpecies, id: string) => 
    [...animalKeys.details(species), id] as const,
  byGender: (species: AnimalSpecies, gender: string, sortBy?: 'asc' | 'desc', discarded?: boolean | null) => 
    [...animalKeys.all(species), 'gender', gender, sortBy ?? 'none', 'discarded', discarded ?? false] as const,
};

/**
 * Hook para obtener todos los animales de una especie (con orden opcional y filtro discarded)
 */
export const useAnimals = (
  species: AnimalSpecies,
  sortBy?: 'asc' | 'desc',
  discarded: boolean | null = false
) => {
  return useQuery({
    queryKey: animalKeys.sorted(species, sortBy, discarded),
    queryFn: () => animalService.getAnimals(species, sortBy, discarded),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener un animal por ID
 */
export const useAnimal = (species: AnimalSpecies, id: string) => {
  return useQuery({
    queryKey: animalKeys.detail(species, id),
    queryFn: () => animalService.getAnimalById(species, id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para obtener animales por género (con orden opcional y filtro discarded)
 */
export const useAnimalsByGender = (
  species: AnimalSpecies,
  gender: 'MALE' | 'FEMALE',
  enabled: boolean = true,
  sortBy?: 'asc' | 'desc',
  discarded: boolean | null = false
) => {
  return useQuery({
    queryKey: animalKeys.byGender(species, gender, sortBy, discarded),
    queryFn: () => animalService.getAnimalsByGender(species, gender, sortBy, discarded),
    enabled: enabled && !!gender,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para crear un animal
 */
export const useCreateAnimal = (species: AnimalSpecies) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (animalData: BaseAnimalCreate) => 
      animalService.createAnimal(species, animalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: animalKeys.lists(species) });
    },
    onError: (error) => {
      logger.error(`Error al crear ${species.toLowerCase()}`, error);
    },
  });
};

/**
 * Hook para actualizar un animal
 */
export const useUpdateAnimal = (species: AnimalSpecies) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, animalData }: { id: string; animalData: BaseAnimalUpdate }) => 
      animalService.updateAnimal(species, id, animalData),
    onSuccess: (updatedAnimal, { id }) => {
      queryClient.invalidateQueries({ queryKey: animalKeys.lists(species) });
      queryClient.invalidateQueries({ queryKey: animalKeys.detail(species, id) });
    },
    onError: (error) => {
      logger.error(`Error al actualizar ${species.toLowerCase()}`, error);
    },
  });
};

/**
 * Hook para eliminar un animal
 */
export const useDeleteAnimal = (species: AnimalSpecies) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => animalService.deleteAnimal(species, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: animalKeys.lists(species) });
      queryClient.invalidateQueries({ queryKey: animalKeys.detail(species, id) });
    },
    onError: (error) => {
      logger.error(`Error al eliminar ${species.toLowerCase()}`, error);
    },
  });
};

/**
 * Hook para descartar un animal
 */
export const useDiscardAnimal = (species: AnimalSpecies) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      animalService.discardAnimal(species, id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: animalKeys.lists(species) });
      queryClient.invalidateQueries({ queryKey: animalKeys.detail(species, id) });
    },
    onError: (error) => {
      logger.error(`Error al descartar ${species.toLowerCase()}`, error);
    },
  });
};

/**
 * Hook para vender un animal
 */
export const useSellAnimal = (species: AnimalSpecies) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      id, 
      saleData 
    }: { 
      id: string; 
      saleData: { 
        price: number; 
        weight?: number; 
        height?: number; 
        notes?: string; 
        sold_by: string; 
        reason?: string;
      } 
    }) => animalService.sellAnimal(species, id, saleData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: animalKeys.lists(species) });
      queryClient.invalidateQueries({ queryKey: animalKeys.detail(species, id) });
    },
    onError: (error) => {
      logger.error(`Error al vender ${species.toLowerCase()}`, error);
    },
  });
};

/**
 * Hook para sacrificar un conejo (solo para rabbits)
 */
export const useSlaughterRabbit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => animalService.slaughterRabbit(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: animalKeys.lists(ANIMAL_SPECIES.RABBIT) });
      queryClient.invalidateQueries({ queryKey: animalKeys.detail(ANIMAL_SPECIES.RABBIT, id) });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    onError: (error) => {
      logger.error('Error al sacrificar conejo', error);
    },
  });
};

/**
 * Hook para refetch manual de animales
 */
export const useRefetchAnimals = (species: AnimalSpecies) => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: animalKeys.lists(species) });
  };
};

