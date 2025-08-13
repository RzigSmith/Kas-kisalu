import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Construction from "@/pages/construction";
import Agriculture from "@/pages/agriculture";
import Elevage from "@/pages/elevage";
import Transport from "@/pages/transport";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";
import VentesMateriaux from "@/pages/ventes-materiaux";
import Immobilier from "@/pages/immobilier";
import Login from "./pages/login";
import Register from "./pages/Register";
import Dashboard from "./pages/admin/Dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/construction" component={Construction} />
      <Route path="/agriculture" component={Agriculture} />
      <Route path="/elevage" component={Elevage} />
      <Route path="/transport" component={Transport} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/ventes-materiaux" component={VentesMateriaux} />
      <Route path="/immobilier" component={Immobilier} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/admin/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
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