import React from 'react';
import { INutritionEntry } from '@/features/nutrition/types';
import { PlusCircle } from 'lucide-react';
import { formatDate } from '@/shared/utils/format';
import { DataEntry, SummaryCard, StatItem, StatRow } from '@/components/ui/';

interface INutritionSummaryProps {
  nutritionData?: {
    today: {
      calories: number;
      protein: number;
      meals: number;
    };
    weekly: {
      averageCalories: number;
      averageProtein: number;
      daysTracked: number;
    };
  };
  isLoading?: boolean;
  latestEntries?: INutritionEntry[];
  onLogFood: () => void;
}

export const NutritionSummary: React.FC<INutritionSummaryProps> = ({
  nutritionData,
  isLoading = false,
  latestEntries = [],
  onLogFood,
}) => {
  // Use most recent entry for display
  const mostRecentEntry = latestEntries[0];

  return (
    <SummaryCard
      title="Nutrition"
      actionLabel="Log"
      actionIcon={<PlusCircle className="h-4 w-4 mr-1" />}
      onAction={onLogFood}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        {/* Today's simple nutrition stats */}
        <StatRow>
          <StatItem
            label="Today"
            value={nutritionData?.today.calories.toFixed(0) || '0'}
            unit="cal"
            valueSize="lg"
          />
          <StatItem
            label="Protein"
            value={nutritionData?.today.protein.toFixed(0) || '0'}
            unit="g"
            valueSize="md"
            className="text-right"
          />
        </StatRow>

        {/* Latest entry */}
        {mostRecentEntry && (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground mb-2">Last Entry</p>
            <DataEntry
              title={
                mostRecentEntry.date
                  ? formatDate(mostRecentEntry.date.toDate())
                  : 'Recent'
              }
              subtitle={`${mostRecentEntry.meals?.length || 0} meals logged`}
              value={mostRecentEntry.dailyTotals?.calories.toFixed(0) || '0'}
              unit="cal"
            />
          </div>
        )}

        {/* Weekly average - simple version */}
        {nutritionData && nutritionData.weekly.daysTracked > 0 && (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground mb-2">Weekly Average</p>
            <DataEntry
              title={`${nutritionData.weekly.averageCalories.toFixed(0)} cal/day`}
              subtitle={`${nutritionData.weekly.daysTracked} days tracked this week`}
            />
          </div>
        )}
      </div>
    </SummaryCard>
  );
};
