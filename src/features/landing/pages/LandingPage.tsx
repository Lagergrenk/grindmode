import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button is here

/**
 * LandingPage component.
 * Displays a brief introduction to the app and a call to action to register.
 */
export function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Welcome to Grind Mode</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your ultimate companion for tracking fitness and diet, helping you
          stay motivated and achieve your health goals. Log workouts, monitor
          nutrition, and see your progress all in one place.
        </p>
      </header>

      <main className="text-center">
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">
            What Grind Mode Offers
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-card rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-2 text-card-foreground">
                Fitness Tracking
              </h3>
              <p className="text-muted-foreground">
                Log your workouts with ease. Track sets, reps and weight for
                various exercises.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-2 text-card-foreground">
                Diet Logging
              </h3>
              <p className="text-muted-foreground">
                Keep a detailed record of your meals and nutritional intake.
                Understand your calorie consumption and macronutrient breakdown.
              </p>
            </div>
          </div>
        </section>

        <Link to="/login">
          <Button size="lg" className="text-lg px-8 py-4">
            Get Started
          </Button>
        </Link>
      </main>
    </div>
  );
}
