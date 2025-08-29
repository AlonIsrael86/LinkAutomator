import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface TopBarProps {
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonAction?: string;
}

export default function TopBar({ title, subtitle, buttonText, buttonAction }: TopBarProps) {
  const [, setLocation] = useLocation();

  const handleButtonClick = () => {
    if (buttonAction) {
      setLocation(buttonAction);
    }
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4" data-testid="topbar">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold" data-testid="topbar-title">{title}</h2>
          <p className="text-muted-foreground" data-testid="topbar-subtitle">{subtitle}</p>
        </div>
        {buttonText && buttonAction && (
          <Button 
            onClick={handleButtonClick}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            data-testid="topbar-button"
          >
            <span className="mr-2">+</span>
            {buttonText}
          </Button>
        )}
      </div>
    </header>
  );
}
