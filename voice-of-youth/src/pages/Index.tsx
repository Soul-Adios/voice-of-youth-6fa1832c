import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { HomePage } from "@/components/HomePage";
import { SubmissionForm } from "@/components/SubmissionForm";
import { Dashboard } from "@/components/Dashboard";
import { Analytics } from "@/components/Analytics";

type ViewType = 'home' | 'submit' | 'dashboard' | 'analytics';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={setCurrentView} />;
      case 'submit':
        return <SubmissionForm />;
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      default:
        return <HomePage onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      {renderCurrentView()}
    </div>
  );
};

export default Index;
