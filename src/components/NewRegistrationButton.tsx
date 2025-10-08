import { Plus } from 'lucide-react';
import { Button } from './ui/button';

export function NewRegistrationButton() {
  return (
    <Button
      size="lg"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-healthcare-secondary hover:bg-healthcare-primary shadow-lg hover:shadow-xl transition-all duration-200 z-50"
      onClick={() => {
        // Handle new registration
        console.log('New registration clicked');
      }}
    >
      <Plus className="h-6 w-6" />
      <span className="sr-only">New Registration</span>
    </Button>
  );
}