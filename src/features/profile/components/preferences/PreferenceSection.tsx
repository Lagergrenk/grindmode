import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface IPreferenceSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

/**
 * Reusable card component for grouping related preference settings
 */
export const PreferenceSection: React.FC<IPreferenceSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">{children}</div>
      </CardContent>
    </Card>
  );
};
