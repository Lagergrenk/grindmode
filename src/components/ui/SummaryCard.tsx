import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ISummaryCardProps {
  title: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
  children?: React.ReactNode;
}

export const SummaryCard: React.FC<ISummaryCardProps> = ({
  title,
  actionLabel,
  actionIcon,
  onAction,
  isLoading = false,
  loadingText = 'Loading data...',
  className = '',
  children,
}) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{title}</span>
          {onAction && (
            <Button
              size="sm"
              variant="outline"
              onClick={onAction}
              className="flex items-center gap-1 h-8"
              disabled={isLoading}
            >
              {actionIcon}
              {actionLabel}
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin mr-2 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">{loadingText}</p>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};
