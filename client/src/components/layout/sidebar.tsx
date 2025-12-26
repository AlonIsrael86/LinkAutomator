import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Globe, 
  Home, 
  Key, 
  Link as LinkIcon, 
  List, 
  Plus, 
  Webhook,
  LogOut,
  Zap
} from "lucide-react";

const navigation = [
  { name: "דשבורד", href: "/", icon: Home },
  { name: "יצירת לינק", href: "/create-link", icon: Plus },
  { name: "הלינקים שלי", href: "/my-links", icon: List },
  { name: "אנליטיקס", href: "/analytics", icon: BarChart3 },
  { name: "וובהוקס", href: "/webhooks", icon: Webhook },
  { name: "דומיין אישי", href: "/custom-domain", icon: Globe },
  { name: "גישת API", href: "/api-access", icon: Key },
];

export default function Sidebar() {
  const [location] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("jit_auth");
    window.location.reload();
  };

  return (
    <aside className="w-64 bg-[#1A1A1A] border-l border-[#333] flex flex-col h-full text-right" data-testid="sidebar">
      <div className="p-6 border-b border-[#333]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#8BDBAB] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(139,219,171,0.3)]">
            <Zap className="text-black h-6 w-6 fill-current" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-white" data-testid="app-title">Just In Time</h1>
            <p className="text-xs text-[#8BDBAB] font-medium tracking-wide">AUTOMATION</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <a
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-[#8BDBAB] text-black font-bold shadow-md"
                        : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive ? "stroke-[2.5]" : "")} />
                    <span>{item.name}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#333]">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">התנתק</span>
        </button>

        <div className="mt-4 flex items-center gap-3 px-3 py-2 bg-[#0A0A0A] rounded-lg border border-[#333]">
          <div className="w-8 h-8 bg-[#8BDBAB]/20 rounded-full flex items-center justify-center border border-[#8BDBAB]/30">
            <span className="text-[#8BDBAB] text-xs font-bold">A</span>
          </div>
          <div className="flex-1 min-w-0 text-right">
            <p className="text-sm font-bold text-white truncate">Alon Israel</p>
            <p className="text-xs text-gray-500 truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}