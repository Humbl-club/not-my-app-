import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Application from "./pages/Application";
import Documents from "./pages/Documents";
import Payment from "./pages/Payment";
import Review from "./pages/Review";
import Confirmation from "./pages/Confirmation";
import Track from "./pages/Track";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/application" element={<Application />} />
          <Route path="/application/documents" element={<Documents />} />
          <Route path="/application/payment" element={<Payment />} />
          <Route path="/application/review" element={<Review />} />
          <Route path="/application/confirmation" element={<Confirmation />} />
          <Route path="/track" element={<Track />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
