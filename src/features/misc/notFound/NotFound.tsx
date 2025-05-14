import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import { Home } from 'lucide-react';

/**
 * A component to display when a route is not found (404 error).
 * It shows a message indicating the page was not found and provides a link
 * to navigate back to the home page.
 */
export const NotFoundPage: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-4 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-6">
        Sorry, the page you are looking for at{' '}
        <code className="bg-muted p-1 rounded-sm text-sm">
          {location.pathname}
        </code>{' '}
        does not exist.
      </p>
      <Button asChild>
        <Link to="/">
          <Home className="mr-2 h-4 w-4" />
          Go to Homepage
        </Link>
      </Button>
    </div>
  );
};
