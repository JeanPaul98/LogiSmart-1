import { Switch, Route , Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Register from "@/pages/Register";
import CreateShipment from "@/pages/CreateShipment";
import Support from "@/pages/Support";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Calcul from "@/pages/CalculTarif";
import Suivi from "@/pages/SuiviColis";
import Search from "@/pages/HSSearch";
import Auth from "@/pages/login";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch key={isAuthenticated ? "auth" : "anon"}>
       <>
        <Route path="/" component={Dashboard} />
        <Route path="/envoie" component={CreateShipment} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/calcul" component={Calcul} />
        <Route path="/suivi" component={Suivi} />
        <Route path="/search" component={Search} />
        <Route path="/support" component={Support} />
      </>

      <Route component={NotFound} />
  </Switch>
  );


{ /*   */}
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
