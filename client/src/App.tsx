import { Switch, Route } from "wouter";
import { queryClient, setTokenGetter } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ClerkProvider,
  useAuth,
  useUser
} from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import CreateLink from "@/pages/create-link";
import MyLinks from "@/pages/my-links";
import Analytics from "@/pages/analytics";
import Webhooks from "@/pages/webhooks";
import CustomDomain from "@/pages/custom-domain";
import ApiAccess from "@/pages/api-access";
import Sidebar from "@/components/layout/sidebar";
import { useEffect, useState } from "react";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AuthenticatedApp() {
  const { getToken } = useAuth();
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    const initToken = async () => {
      setTokenGetter(getToken);
      // Wait for token to be ready
      await getToken();
      setTokenReady(true);
    };
    initToken();
  }, [getToken]);

  // Show loading until token is ready
  if (!tokenReady) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]" dir="rtl">
      <Sidebar />
      <main className="flex-1 overflow-auto w-full lg:w-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
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

function AppContent() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <LandingPage />;
  }

  return <AuthenticatedApp />;
}

function App() {
  if (!clerkPublishableKey) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] text-white">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Clerk Configuration Required</h1>
              <p className="text-gray-400">Please set VITE_CLERK_PUBLISHABLE_KEY in your environment variables.</p>
            </div>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}      
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#4ade80',
          colorBackground: '#1a1a1a',
          colorInputBackground: '#2a2a2a',
          colorInputText: '#ffffff',
          colorText: '#ffffff',
          colorTextSecondary: '#a1a1aa',
          borderRadius: '0.5rem',
        },
        elements: {
          rootBox: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          card: {
            backgroundColor: '#1f2937',
            borderColor: '#374151',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            margin: '0 auto',
          },
          headerTitle: {
            color: '#ffffff',
          },
          headerSubtitle: {
            color: '#9ca3af',
          },
          formButtonPrimary: {
            backgroundColor: '#4ade80',
            color: '#000000',
          },
          formFieldInput: {
            backgroundColor: '#374151',
            borderColor: '#4b5563',
            color: '#ffffff',
          },
          footerActionLink: {
            color: '#4ade80',
          },
          userButtonPopoverCard: {
            backgroundColor: '#1f2937',
            borderColor: '#374151',
          },
          userButtonPopoverActionButton: {
            color: '#ffffff',
          },
          userButtonPopoverActionButtonText: {
            color: '#ffffff',
          },
          userButtonPopoverFooter: {
            display: 'none',
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
