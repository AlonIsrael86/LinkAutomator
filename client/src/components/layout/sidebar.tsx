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
  Webhook 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Create Link", href: "/create-link", icon: Plus },
  { name: "My Links", href: "/my-links", icon: List },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Webhooks", href: "/webhooks", icon: Webhook },
  { name: "Custom Domain", href: "/custom-domain", icon: Globe },
  { name: "API Access", href: "/api-access", icon: Key },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col" data-testid="sidebar">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <LinkIcon className="text-primary-foreground h-4 w-4" />
          </div>
          <div>
            <h1 className="font-semibold text-lg" data-testid="app-title">Link Automator</h1>
            <p className="text-sm text-muted-foreground">Personal URL Shortener</p>
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
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    data-testid={`nav-link-${item.href.replace('/', '') || 'dashboard'}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-muted-foreground rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" data-testid="user-name">Personal Account</p>
            <p className="text-xs text-muted-foreground truncate">links.yourdomain.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
