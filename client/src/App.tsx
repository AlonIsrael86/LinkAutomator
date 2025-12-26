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
import { useEffect } from "react";

// #region agent log
const LOG_ENDPOINT = 'http://127.0.0.1:7243/ingest/58a5141c-77e9-4e25-8e89-e0ca371e4243';
const log = (location: string, message: string, data: any, hypothesisId?: string) => {
  fetch(LOG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location,
      message,
      data,
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId
    })
  }).catch(() => {});
};
// #endregion agent log

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AuthenticatedApp() {
  const { getToken } = useAuth();

  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]" dir="rtl">
      <Sidebar />
      <main className="flex-1 overflow-auto w-full lg:w-auto">
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

function AppContent() {
  // #region agent log
  log('App.tsx:52', 'AppContent function entry', {}, 'B');
  // #endregion agent log
  
  const { isSignedIn, isLoaded } = useUser();

  // #region agent log
  log('App.tsx:56', 'useUser hook values', { isSignedIn, isLoaded }, 'B');
  // #endregion agent log

  console.log("DEBUG - isLoaded:", isLoaded, "isSignedIn:", isSignedIn);

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    // #region agent log
    log('App.tsx:63', 'Returning loading spinner', { isLoaded, isSignedIn }, 'B');
    // #endregion agent log
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Show landing page if not signed in
  if (!isSignedIn) {
    // #region agent log
    // Visual indicator
    useEffect(() => {
      const indicator = document.getElementById('debug-indicator');
      if (indicator) {
        indicator.style.background = 'orange';
        indicator.textContent = '🟡 RETURNING LANDING PAGE';
      }
    }, []);
    
    console.log('🟡🟡🟡 RETURNING LANDING PAGE - isSignedIn is FALSE 🟡🟡🟡');
    console.log('[DEBUG] AppContent: Returning LandingPage, isSignedIn:', isSignedIn, 'isLoaded:', isLoaded);
    console.log('[DEBUG] AppContent: About to render LandingPage component');
    try {
      log('App.tsx:97', 'Returning LandingPage component', { isSignedIn, isLoaded }, 'A');
    } catch (e) {
      console.error('[DEBUG] AppContent: Error logging:', e);
    }
    // #endregion agent log
    const landingPageElement = <LandingPage />;
    console.log('[DEBUG] AppContent: LandingPage element created:', landingPageElement);
    return landingPageElement;
  }

  // Show authenticated app
  // #region agent log
  log('App.tsx:77', 'Returning AuthenticatedApp component', { isSignedIn, isLoaded }, 'B');
  // #endregion agent log
  return <AuthenticatedApp />;
}

function App() {
  // #region agent log
  // Visual indicator
  useEffect(() => {
    const indicator = document.getElementById('debug-indicator');
    if (indicator) {
      indicator.style.background = 'green';
      indicator.textContent = '🟢 APP FUNCTION EXECUTING';
    }
  }, []);
  
  console.log('🟢🟢🟢 APP FUNCTION EXECUTING - IF YOU SEE THIS, APP IS RENDERING 🟢🟢🟢');
  console.log('[DEBUG] App function executing - TOP LEVEL');
  console.log('[DEBUG] App - clerkPublishableKey exists:', !!clerkPublishableKey);
  console.log('[DEBUG] App - window.location:', window.location.href);
  
  useEffect(() => {
    console.log('[DEBUG] App useEffect running');
    log('App.tsx:91', 'App component mounted', { 
      hasClerkKey: !!clerkPublishableKey,
      windowLocation: window.location.href 
    }, 'D');
    
    // Monitor for navigation changes
    const handlePopState = () => {
      log('App.tsx:98', 'Navigation detected (popstate)', { 
        windowLocation: window.location.href 
      }, 'D');
    };
    window.addEventListener('popstate', handlePopState);
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  // #endregion agent log
  
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

  // #region agent log
  console.log('[DEBUG] App: About to render ClerkProvider');
  console.log('[DEBUG] App: Rendering ClerkProvider with key:', !!clerkPublishableKey);
  log('App.tsx:115', 'Rendering ClerkProvider', { 
    hasClerkKey: !!clerkPublishableKey,
    windowLocation: window.location.href 
  }, 'E');
  // #endregion agent log

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
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
          card: {
            backgroundColor: '#1f2937',
            borderColor: '#374151',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
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