import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Register from "@/pages/Register";
import CreateShipment from "@/pages/CreateShipment";
import Dashboard from "@/pages/Dashboard";
import Support from "@/pages/Support";
import NotFound from "@/pages/not-found";
import Auth from "@/pages/login";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
      <Switch key={isAuthenticated ? "auth" : "anon"}>
            {!isAuthenticated ? (
              <>
                <Route path="/" component={Auth} />
                <Route path="/login" component={Auth} />   {/* alias utile */}
                <Route path="/register" component={Register} />
              </>
            ) : (
              <>
                <Route path="/create" component={CreateShipment} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/support" component={Support} />
                {/* Page 404 */}
              </>
            )}
        <Route component={NotFound} />
      </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
