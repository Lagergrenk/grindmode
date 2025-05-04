import { INutritionEntry } from '@/types';
import { FirestoreService } from './firestore.service';

const nutritionService = new FirestoreService<INutritionEntry>('nutrition');

/**
 * Add a new nutrition entry to Firestore
 * @param entry - Nutrition entry to add
 */
export const addNutritionEntry = async (
  entry: Omit<INutritionEntry, 'date'> | Partial<INutritionEntry>,
): Promise<string> => {
  try {
    return await nutritionService.add(entry);
  } catch (error) {
    console.error('Error adding nutrition entry:', error);
    throw error;
  }
};

/**
 * Get all nutrition entries from Firestore
 * @param max - Maximum number of entries to fetch
 * @returns
 */
export const getNutritionEntries = async (
  max?: number,
): Promise<INutritionEntry[]> => {
  try {
    return await nutritionService.getAll(max);
  } catch (error) {
    console.error('Error fetching nutrition entries:', error);
    return [];
  }
};

export const getNutritionEntryById = async (
  entryId: string,
): Promise<INutritionEntry | null> => {
  try {
    return await nutritionService.getById(entryId);
  } catch (error) {
    console.error(`Error fetching nutrition entry ${entryId}:`, error);
    return null;
  }
};

/**
 * Update a nutrition entry in Firestore
 * @param entryId - ID of the nutrition entry to update
 * @param entryData - Partial nutrition entry data to update
 */
export const updateNutritionEntry = async (
  entryId: string,
  entryData: Partial<INutritionEntry>,
): Promise<boolean> => {
  try {
    return await nutritionService.update(entryId, entryData);
  } catch (error) {
    console.error(`Error updating nutrition entry ${entryId}:`, error);
    return false;
  }
};

/**
 * Delete a nutrition entry from Firestore
 * @param entryId - ID of the nutrition entry to delete
 */
export const deleteNutritionEntry = async (
  entryId: string,
): Promise<boolean> => {
  try {
    return await nutritionService.delete(entryId);
  } catch (error) {
    console.error(`Error deleting nutrition entry ${entryId}:`, error);
    return false;
  }
};

/**
 * Get nutrition entries by date
 * @param date - Date to fetch nutrition entries for
 */
export const getNutritionEntriesByDate = async (
  date: Date,
): Promise<INutritionEntry[]> => {
  try {
    return await nutritionService.getByDate(date);
  } catch (error) {
    console.error('Error fetching nutrition entries by date:', error);
    return [];
  }
};

/**
 * Get nutrition entries in a date range
 * @param startDate - Date to start the range
 * @param endDate - Date to end the range
 */
export const getNutritionInDateRange = async (
  startDate: Date,
  endDate: Date,
): Promise<INutritionEntry[]> => {
  try {
    return await nutritionService.getByDateRange(startDate, endDate);
  } catch (error) {
    console.error('Error fetching nutrition entries in date range:', error);
    return [];
  }
};

/**
 * Get nutrition summary for the last 7 days
 */
export const getNutritionSummary = async (): Promise<INutritionEntry[]> => {
  try {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7);

    return await nutritionService.getByDateRange(startDate, today);
  } catch (error) {
    console.error('Error fetching nutrition summary:', error);
    return [];
  }
};
