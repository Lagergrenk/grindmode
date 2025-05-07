import React, { useState } from 'react';
import {
  IFoodItem,
  IFoodSearchResult,
  FormGroup,
  FoodSearch,
} from '@/features/nutrition';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { validateFoodForm } from '@/shared/utils/validateFood';
import { usdaApi } from '@/services/usda.api.service';

interface IFoodItemFormProps {
  onSubmit: (foodItem: IFoodItem) => void;
  onCancel: () => void;
  initValues?: IFoodItem;
}

const UNIT_OPTIONS = [
  { value: 'g', label: 'grams (g)' },
  { value: 'ml', label: 'milliliters (ml)' },
];

const NUTRITION_FIELDS = [
  { id: 'calories', label: 'Calories', placeholder: '165', unit: '' },
  { id: 'protein', label: 'Protein', placeholder: '31', unit: 'g' },
  { id: 'carbs', label: 'Carbs', placeholder: '0', unit: 'g' },
  { id: 'fat', label: 'Fat', placeholder: '3.6', unit: 'g' },
];

export const FoodItemForm: React.FC<IFoodItemFormProps> = ({
  onSubmit,
  onCancel,
  initValues,
}) => {
  // Form state
  const [formData, setFormData] = useState<IFoodItem>({
    name: initValues?.name || '',
    quantity: initValues?.quantity || 100,
    calories: initValues?.calories || 0,
    protein: initValues?.protein || 0,
    carbs: initValues?.carbs || 0,
    fat: initValues?.fat || 0,
    unit: initValues?.unit || 'g',
  });

  // Form validation state
  const [errors, setErrors] = useState({
    name: '',
    quantity: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  // Handle food selection from search
  const handleSelectFood = (food: IFoodSearchResult) => {
    const nutrients = usdaApi.extractNutrients(food);

    setFormData({
      ...formData,
      name: food.description,
      quantity: 100, // Default to 100g serving
      calories: Math.round(nutrients.calories || 0),
      protein: Math.round(nutrients.protein || 0),
      carbs: Math.round(nutrients.carbs || 0),
      fat: Math.round(nutrients.fat || 0),
    });

    // Clear any existing errors since we're setting valid data
    setErrors({
      name: '',
      quantity: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
    });
  };

  // Handle input changes for text and numeric fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const field = id.replace('food-', '');

    // Convert numeric fields to numbers
    const numericFields = ['quantity', 'calories', 'protein', 'carbs', 'fat'];
    const processedValue = numericFields.includes(field)
      ? parseFloat(value) || 0
      : value;

    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));

    // Clear error when field is updated
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Handle unit selection
  const handleUnitChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      unit: value,
    }));
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateFoodForm(formData);
    setErrors(validationErrors.newErrors);
    if (!validationErrors.isValid) return;

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Food Search */}
      <div className="mb-6">
        <Label className="text-sm font-medium block mb-2">
          Search USDA Food Database
        </Label>
        <FoodSearch
          onSelectFood={handleSelectFood}
          buttonLabel="Select"
          autoFocus={!initValues}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Search for foods to automatically fill nutrition information
        </p>
      </div>

      {/* Food Name */}
      <FormGroup>
        <Label htmlFor="food-name" className="text-sm font-medium">
          Food Name
        </Label>
        <Input
          id="food-name"
          placeholder="e.g., Chicken Breast"
          value={formData.name}
          onChange={handleInputChange}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && (
          <div className="flex items-center mt-1 text-destructive text-xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            <span>{errors.name}</span>
          </div>
        )}
      </FormGroup>

      {/* Quantity and Unit */}
      <div className="grid grid-cols-2 gap-3">
        <FormGroup>
          <Label htmlFor="food-quantity" className="text-sm font-medium">
            Quantity
          </Label>
          <Input
            id="food-quantity"
            type="number"
            placeholder="100"
            value={formData.quantity === 0 ? '' : formData.quantity}
            onChange={handleInputChange}
            min="0"
            step="any"
            className={errors.quantity ? 'border-destructive' : ''}
          />
          {errors.quantity && (
            <div className="flex items-center mt-1 text-destructive text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>{errors.quantity}</span>
            </div>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="food-unit" className="text-sm font-medium">
            Unit
          </Label>
          <Select value={formData.unit} onValueChange={handleUnitChange}>
            <SelectTrigger id="food-unit">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {UNIT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormGroup>
      </div>

      {/* Nutrition Information */}
      <div>
        <h3 className="text-sm font-medium mb-2">Nutrition Information</h3>
        <div className="grid grid-cols-2 gap-3">
          {NUTRITION_FIELDS.map((field) => (
            <FormGroup key={field.id}>
              <Label
                htmlFor={`food-${field.id}`}
                className="text-sm font-medium"
              >
                {field.label}
                {field.unit ? ` (${field.unit})` : ''}
              </Label>
              <Input
                id={`food-${field.id}`}
                type="number"
                placeholder={field.placeholder}
                value={
                  formData[field.id as keyof typeof formData] === 0
                    ? ''
                    : formData[field.id as keyof typeof formData]
                }
                onChange={handleInputChange}
                min="0"
                step="any"
                className={
                  errors[field.id as keyof typeof errors]
                    ? 'border-destructive'
                    : ''
                }
              />
              {errors[field.id as keyof typeof errors] && (
                <div className="flex items-center mt-1 text-destructive text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  <span>{errors[field.id as keyof typeof errors]}</span>
                </div>
              )}
            </FormGroup>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm">
          {initValues ? 'Update' : 'Add'} Food Item
        </Button>
      </div>
    </form>
  );
};
