import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Plus, Sparkles } from "lucide-react";

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
    <header className="bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A] to-[#1A1A1A]/80 border-b border-[#333] px-8 py-6" data-testid="topbar">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold jit-gradient-text" data-testid="topbar-title">{title}</h2>
          <p className="text-gray-400 text-sm" data-testid="topbar-subtitle">{subtitle}</p>
        </div>
        {buttonText && buttonAction && (
          <Button 
            onClick={handleButtonClick}
            className="bg-[#8BDBAB] hover:bg-[#7AC99A] text-black font-bold px-6 py-3 rounded-xl shadow-lg glow-green-sm transition-all duration-300 hover:scale-105 flex items-center gap-2"
            data-testid="topbar-button"
          >
            <Plus className="h-5 w-5" />
            {buttonText}
            <Sparkles className="h-4 w-4 opacity-70" />
          </Button>
        )}
      </div>
    </header>
  );
}
