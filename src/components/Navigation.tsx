import { Button } from "@/components/ui/button";
import { MessageSquare, BarChart3, Users, Megaphone } from "lucide-react";

interface NavigationProps {
  currentView: 'home' | 'submit' | 'dashboard' | 'analytics';
  onViewChange: (view: 'home' | 'submit' | 'dashboard' | 'analytics') => void;
}

export const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Megaphone className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Voice of the Youth</h1>
          </div>
          
          <div className="hidden md:flex space-x-1">
            <Button
              variant={currentView === 'home' ? 'default' : 'ghost'}
              onClick={() => onViewChange('home')}
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Home</span>
            </Button>
            
            <Button
              variant={currentView === 'submit' ? 'default' : 'ghost'}
              onClick={() => onViewChange('submit')}
              className="flex items-center space-x-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Submit</span>
            </Button>
            
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => onViewChange('dashboard')}
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
            
            <Button
              variant={currentView === 'analytics' ? 'default' : 'ghost'}
              onClick={() => onViewChange('analytics')}
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </Button>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <select
              value={currentView}
              onChange={(e) => onViewChange(e.target.value as any)}
              className="bg-background border border-border rounded-md px-3 py-1"
            >
              <option value="home">Home</option>
              <option value="submit">Submit</option>
              <option value="dashboard">Dashboard</option>
              <option value="analytics">Analytics</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};