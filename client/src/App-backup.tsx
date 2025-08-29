import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import CreateLink from "@/pages/create-link";
import MyLinks from "@/pages/my-links";
import Analytics from "@/pages/analytics";
import Webhooks from "@/pages/webhooks";
import CustomDomain from "@/pages/custom-domain";
import ApiAccess from "@/pages/api-access";
import Sidebar from "@/components/layout/sidebar";

function Router() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;