import { Search, Settings, User, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
}

export function Header({ onToggleSidebar, onOpenProfile, onOpenSettings }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-6 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        {/* Logo and Menu Toggle */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="text-healthcare-primary hover:bg-healthcare-light"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-healthcare-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MT</span>
            </div>
            <h1 className="text-xl font-bold text-healthcare-primary">MediTrack</h1>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 ml-8">
          <button className="text-healthcare-primary hover:text-healthcare-secondary font-medium border-b-2 border-healthcare-secondary pb-1">
            Home
          </button>
          <button 
            onClick={onOpenSettings}
            className="text-muted-foreground hover:text-healthcare-primary font-medium"
          >
            Settings
          </button>
          <button 
            onClick={onOpenProfile}
            className="text-muted-foreground hover:text-healthcare-primary font-medium"
          >
            Profile
          </button>
        </nav>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative w-80 hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="pl-10 bg-healthcare-light/30 border-healthcare-light"
          />
        </div>

        {/* Action Buttons */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenSettings}
          className="text-healthcare-primary hover:bg-healthcare-light"
        >
          <Settings className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenProfile}
          className="text-healthcare-primary hover:bg-healthcare-light"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}