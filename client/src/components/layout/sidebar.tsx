import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Globe, 
  LayoutDashboard, 
  Key, 
  List, 
  Plus, 
  Webhook,
  Zap,
  ChevronLeft,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";

const navigation = [
  { name: "דשבורד", href: "/", icon: LayoutDashboard },
  { name: "יצירת לינק", href: "/create-link", icon: Plus },
  { name: "הלינקים שלי", href: "/my-links", icon: List },
  { name: "אנליטיקס", href: "/analytics", icon: BarChart3 },
  { name: "וובהוקס", href: "/webhooks", icon: Webhook },
  { name: "דומיין אישי", href: "/custom-domain", icon: Globe },
  { name: "גישת API", href: "/api-access", icon: Key },
];

export default function Sidebar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-[#333]/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#8BDBAB] to-[#6BC48E] rounded-2xl flex items-center justify-center shadow-lg">
            <Zap className="text-black h-7 w-7 fill-current" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tight text-white" data-testid="app-title">Just In Time</h1>
            <p className="text-xs text-[#8BDBAB] font-semibold tracking-widest uppercase">Automation</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-[#8BDBAB] hover:bg-[#7AC99A] text-black font-semibold rounded-lg transition-colors text-sm">
                התחבר
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 bg-[#2A2A2A] hover:bg-[#333] text-white font-semibold rounded-lg transition-colors text-sm border border-[#333]">
                הרשם
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "bg-[#1A1A1A] border-[#333]",
                  userButtonPopoverActionButton: "text-white hover:bg-[#2A2A2A]",
                }
              }}
            />
          </SignedIn>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <a 
                    className={cn(
                      "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group",
                      isActive
                        ? "bg-gradient-to-l from-[#8BDBAB] to-[#6BC48E] text-black font-bold shadow-lg"
                        : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className={cn("h-5 w-5 transition-transform duration-300", isActive ? "stroke-[2.5]" : "group-hover:scale-110")} />
                    <span className="flex-1">{item.name}</span>
                    {isActive && <ChevronLeft className="h-4 w-4 opacity-70" />}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-[#1A1A1A] border border-[#333] rounded-xl text-white"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/70 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={cn(
          "lg:hidden fixed top-0 right-0 h-full w-72 bg-gradient-to-b from-[#1A1A1A] to-[#111] border-l border-[#333]/50 flex flex-col z-50 transition-transform duration-300",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-gradient-to-b from-[#1A1A1A] to-[#111] border-l border-[#333]/50 flex-col h-full" data-testid="sidebar">
        <SidebarContent />
      </aside>
    </>
  );
}
