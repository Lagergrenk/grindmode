import { useState, useCallback, useEffect } from 'react';
import { exerciseApi } from '@/services/exercise.api.service';
import { IExerciseDefinition, IExerciseSearchResult } from '../types';
import { useDebounce } from '@/hooks/useDebounce';

/**
 * Interface for the exercise data hook return values
 */
export interface IUseExerciseData {
  searchTerm: string;
  searchResults: IExerciseDefinition[];
  isSearching: boolean;
  error: string | null;
  setSearchTerm: (term: string) => void;
  selectExercise: (exerciseId: string) => Promise<IExerciseDefinition | null>;
  mapApiExerciseToDefinition: (
    apiExercise: IExerciseSearchResult,
  ) => IExerciseDefinition;
}

/**
 * Custom hook for managing exercise search and selection
 * @returns Exercise data management functions and state
 */
export const useExerciseData = (): IUseExerciseData => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<IExerciseDefinition[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * Maps API exercise data to application exercise definition format
   * @param apiExercise - Exercise data from API
   * @returns Formatted exercise definition
   */
  const mapApiExerciseToDefinition = useCallback(
    (apiExercise: IExerciseSearchResult): IExerciseDefinition => {
      return {
        id: apiExercise.exerciseId,
        name: apiExercise.name,
        muscleGroup: apiExercise.targetMuscles?.length
          ? apiExercise.targetMuscles[0]
          : 'General',
        equipment: apiExercise.equipments?.length
          ? apiExercise.equipments[0]
          : undefined,
        instructions: apiExercise.instructions || [],
        imageUrl: apiExercise.gifUrl,
        targetMuscles: apiExercise.targetMuscles,
        secondaryMuscles: apiExercise.secoundaryMuscles,
        bodyParts: apiExercise.bodyParts,
      };
    },
    [],
  );

  /**
   * Performs search when debounced search term changes
   */
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const apiResults =
          await exerciseApi.searchExercises(debouncedSearchTerm);

        if (apiResults.success && Array.isArray(apiResults.data)) {
          const formattedResults = apiResults.data.map(
            mapApiExerciseToDefinition,
          );
          setSearchResults(formattedResults);
        } else {
          setError("Couldn't retrieve exercise data. Format error.");
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error searching exercises:', error);
        setError("Couldn't connect to exercise database.");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchTerm, mapApiExerciseToDefinition]);

  /**
   * Selects an exercise and fetches its full details
   * @param exerciseId - The ID of the exercise to fetch
   * @returns The complete exercise definition or null if failed
   */
  const selectExercise = useCallback(
    async (exerciseId: string): Promise<IExerciseDefinition | null> => {
      try {
        const fullExercise = await exerciseApi.getExerciseById(exerciseId);
        if (fullExercise.success) {
          return mapApiExerciseToDefinition(fullExercise.data);
        } else {
          setError('Failed to fetch exercise details. Please try again.');
          return null;
        }
      } catch (error) {
        console.error('Error fetching exercise details:', error);
        setError('Failed to fetch exercise details. Please try again.');
        return null;
      }
    },
    [mapApiExerciseToDefinition],
  );

  return {
    searchTerm,
    searchResults,
    isSearching,
    error,
    setSearchTerm,
    selectExercise,
    mapApiExerciseToDefinition,
  };
};
