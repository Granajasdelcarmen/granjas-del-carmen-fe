import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rabbitSpecificService } from 'src/services/rabbitSpecificService';
import { animalKeys } from 'src/hooks/useAnimals';
import { ANIMAL_SPECIES } from 'src/constants/animals';
import { logger } from 'src/utils/logger';

const SPECIES = ANIMAL_SPECIES.RABBIT;

/**
 * Hook para crear una camada de conejos (funcionalidad específica de conejos)
 */
export const useCreateRabbitLitter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (litterData: {
      mother_id: string;
      father_id?: string;
      birth_date: string;
      count: number;
      genders?: ('MALE' | 'FEMALE')[];
      name_prefix?: string;
      corral_id?: string;
      dead_count?: number;
      dead_notes?: string;
      dead_suspected_cause?: string;
    }) => rabbitSpecificService.createLitter(litterData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: animalKeys.lists(SPECIES) });
    },
    onError: (error) => {
      logger.error('Error al crear camada', error);
    },
  });
};
