import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <Loader2 className="animate-spin h-12 w-12 text-primary mb-4" />
      <p className="text-xl font-semibold">Loading...</p>
      <p className="text-sm text-muted-foreground">Please wait a moment.</p>
    </div>
  );
};
