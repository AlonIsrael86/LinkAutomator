import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ArrowLeft } from "lucide-react";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import CreateLink from "@/pages/create-link";
import MyLinks from "@/pages/my-links";
import Analytics from "@/pages/analytics";
import Webhooks from "@/pages/webhooks";
import CustomDomain from "@/pages/custom-domain";
import ApiAccess from "@/pages/api-access";
import Sidebar from "@/components/layout/sidebar";

// Login Modal Component
function LoginModal({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        localStorage.setItem("jit_auth", "true");
        onLogin();
      } else {
        setError("סיסמה שגויה");
      }
    } catch (err) {
      setError("שגיאת התחברות");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#1A1A1A] border border-[#333] rounded-xl p-8 shadow-2xl text-center space-y-6">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#8BDBAB]/10 rounded-full flex items-center justify-center border border-[#8BDBAB]/20">
            <Lock className="w-8 h-8 text-[#8BDBAB]" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">Just In Time</h1>
          <p className="text-[#9CA3AF]">הכניסה מותרת למשתמשים מורשים בלבד</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-right">
             <Input
              type="password"
              placeholder="סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#0A0A0A] border-[#333] text-white h-12 text-lg text-right direction-rtl"
              autoFocus
            />
          </div>
          
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 text-lg font-bold bg-[#8BDBAB] text-black hover:bg-[#7AC99A] transition-all"
          >
            {loading ? "מתחבר..." : "כניסה למערכת"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function Router() {
  return (
    <div className="flex h-screen bg-background font-sans" dir="rtl">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-[#0A0A0A]">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/create-link" component={CreateLink} />
          <Route path="/my-links" component={MyLinks} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/webhooks" component={Webhooks} />
          <Route path="/custom-domain" component={CustomDomain} />
          <Route path="/api-access" component={ApiAccess} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Set HTML direction to RTL for JIT standards
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "he";
    document.documentElement.classList.add('dark');

    const auth = localStorage.getItem("jit_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setChecking(false);
  }, []);

  if (checking) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {!isAuthenticated ? (
          <div dir="rtl">
            <LoginModal onLogin={() => setIsAuthenticated(true)} />
          </div>
        ) : (
          <Router />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;