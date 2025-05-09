import { useState, useCallback, useEffect } from 'react';
import { exerciseApi } from '@/features/workoutplanner';
import { IExerciseSearchResultItem } from '../types';
import { useDebounce } from '@/hooks/useDebounce';

/**
 * Interface for the exercise data hook return values
 */
export interface IUseExerciseData {
  searchTerm: string;
  searchResults: IExerciseSearchResultItem[];
  isSearching: boolean;
  error: string | null;
  setSearchTerm: (term: string) => void;
  selectExercise: (
    exerciseId: string,
  ) => Promise<IExerciseSearchResultItem | null>;
}

/**
 * Custom hook for managing exercise search and selection
 * @returns Exercise data management functions and state
 */
export const useExerciseData = (): IUseExerciseData => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<
    IExerciseSearchResultItem[]
  >([]);
  const [error, setError] = useState<string | null>(null);

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
          setSearchResults(apiResults.data);
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
  }, [debouncedSearchTerm]);

  /**
   * Selects an exercise and fetches its full details
   * @param exerciseId - The ID of the exercise to fetch
   * @returns The complete exercise definition or null if failed
   */
  const selectExercise = useCallback(
    async (exerciseId: string): Promise<IExerciseSearchResultItem | null> => {
      setIsSearching(true);
      try {
        const fullExercise = await exerciseApi.getExerciseById(exerciseId);
        if (fullExercise.success) {
          return fullExercise.data;
        } else {
          setError('Failed to fetch exercise details. Please try again.');
          return null;
        }
      } catch (error) {
        console.error('Error fetching exercise details:', error);
        setError('Failed to fetch exercise details. Please try again.');
        return null;
      } finally {
        setIsSearching(false);
      }
    },
    [],
  );

  return {
    searchTerm,
    searchResults,
    isSearching,
    error,
    setSearchTerm,
    selectExercise,
  };
};
