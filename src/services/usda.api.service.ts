import { IFoodSearchResult, INutrientInfo } from '@/types';
import { IImportMeta } from '../../vite-env';

const VITE_USDA_API_KEY: IImportMeta = import.meta.env.VITE_USDA_API_KEY;
const USDA_API_BASE_URL: IImportMeta = import.meta.env.VITE_USDA_API_BASE_URL;

// Nutrient IDs from USDA API
const NUTRIENT_IDS = {
  calories: 1008, // Energy (kcal)
  protein: 1003, // Protein
  carbs: 1005, // Carbohydrates
  fat: 1004, // Total lipids (fat)
  fiber: 1079, // Fiber
  sugar: 2000, // Sugars
  sodium: 1093, // Sodium
};

export const usdaApi = {
  /**
   * Search for foods by name/description
   */
  searchFoods: async (
    query: string,
    pageSize = 20,
  ): Promise<IFoodSearchResult[]> => {
    try {
      const response = await fetch(
        `${USDA_API_BASE_URL}/foods/search?api_key=${VITE_USDA_API_KEY}&query=${encodeURIComponent(
          query,
        )}&pageSize=${pageSize}`,
      );

      if (!response.ok) {
        throw new Error(`USDA API error: ${response.status}`);
      }

      const data = await response.json();
      return data.foods || [];
    } catch (error) {
      console.error('Error searching foods:', error);
      throw error;
    }
  },

  /**
   * Get detailed information about a specific food by its FDC ID
   */
  getFoodDetails: async (fdcId: number): Promise<IFoodSearchResult> => {
    try {
      const response = await fetch(
        `${USDA_API_BASE_URL}/food/${fdcId}?api_key=${VITE_USDA_API_KEY}`,
      );

      if (!response.ok) {
        throw new Error(`USDA API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error getting food details for ID ${fdcId}:`, error);
      throw error;
    }
  },

  /**
   * Extract common nutrient values from food data
   */
  extractNutrients: (food: IFoodSearchResult): INutrientInfo => {
    const nutrients = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    };

    food.foodNutrients.forEach((nutrient) => {
      switch (nutrient.nutrientId) {
        case NUTRIENT_IDS.calories:
          nutrients.calories = nutrient.value;
          break;
        case NUTRIENT_IDS.protein:
          nutrients.protein = nutrient.value;
          break;
        case NUTRIENT_IDS.carbs:
          nutrients.carbs = nutrient.value;
          break;
        case NUTRIENT_IDS.fat:
          nutrients.fat = nutrient.value;
          break;
        case NUTRIENT_IDS.fiber:
          nutrients.fiber = nutrient.value;
          break;
        case NUTRIENT_IDS.sugar:
          nutrients.sugar = nutrient.value;
          break;
        case NUTRIENT_IDS.sodium:
          nutrients.sodium = nutrient.value;
          break;
        default:
          break;
      }
    });

    return nutrients;
  },
};
