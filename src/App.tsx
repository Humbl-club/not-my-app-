import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouteGuard } from "@/components/RouteGuard";
import Index from "./pages/Index";
import Application from "./pages/Application";
import ApplicationManager from "./pages/ApplicationManager";
import ApplicantForm from "./pages/ApplicantForm";
import ApplicantDocuments from "./pages/ApplicantDocuments";
import Payment from "./pages/Payment";
import Review from "./pages/Review";
import Confirmation from "./pages/Confirmation";
import ResumeApplication from "./pages/ResumeApplication";
import AccountProgress from "./pages/AccountProgress";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import TrackApplication from "./pages/TrackApplication";
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
          <Route path="/application/manage" element={<ApplicationManager />} />
          <Route path="/application/applicant/:id" element={<ApplicantForm />} />
          <Route path="/application/applicant/:id/documents" element={<RouteGuard><ApplicantDocuments /></RouteGuard>} />
          <Route path="/application/payment" element={<RouteGuard><Payment /></RouteGuard>} />
          <Route path="/application/review" element={<RouteGuard><Review /></RouteGuard>} />
          <Route path="/application/confirmation" element={<RouteGuard><Confirmation /></RouteGuard>} />
          <Route path="/resume/:token" element={<ResumeApplication />} />
          <Route path="/account" element={<AccountProgress />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Tracking Route */}
          <Route path="/track" element={<TrackApplication />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
