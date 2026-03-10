import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AddCriminal from "./components/AddCriminal";
import CriminalDatabase from "./components/CriminalDatabase";
import InvestigationMode from "./components/InvestigationMode";
import SQLConsole from "./components/SQLConsole";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/add-criminal" element={<AddCriminal />} />
          <Route path="/database" element={<CriminalDatabase />} />
          <Route path="/investigate" element={<InvestigationMode />} />
          <Route path="/console" element={<SQLConsole />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
