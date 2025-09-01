import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { RouteGuard } from "@/components/RouteGuard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MobileNav } from "@/components/MobileNav";

// Loading component for better UX
const PageLoader = () => <LoadingSpinner size="lg" text="Loading page..." fullScreen />;

// Critical path - load immediately (landing and application start)
import Index from "./pages/Index";
import Application from "./pages/ApplicationPro";

// Secondary routes - lazy load
const ApplicationManager = lazy(() => import("./pages/ApplicationManagerPro"));
const ApplicantForm = lazy(() => import("./pages/ApplicantFormPro"));
const ApplicantDocuments = lazy(() => import("./pages/ApplicantDocumentsPro"));
const Payment = lazy(() => import("./pages/PaymentPro"));
const Review = lazy(() => import("./pages/ReviewPro"));
const Confirmation = lazy(() => import("./pages/Confirmation"));
const ResumeApplication = lazy(() => import("./pages/ResumeApplication"));
const AccountProgress = lazy(() => import("./pages/AccountProgressPro"));
const Requirements = lazy(() => import("./pages/Requirements"));
const Help = lazy(() => import("./pages/Help"));

// Admin routes - separate chunk
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboardSupabase"));

// Test route for Phase 1 integration
const TestIntegration = lazy(() => import("./pages/TestIntegration"));

// Polished UI pages
const TrackPolished = lazy(() => import("./pages/TrackPolished"));
const DashboardPolished = lazy(() => import("./pages/DashboardPolished"));
const ResourcesIndex = lazy(() => import("./pages/ResourcesIndex"));
const ResourceArticle = lazy(() => import("./pages/ResourceArticle"));
const GuideLanding = lazy(() => import("./pages/GuideLanding"));
const ImmigrationLanding = lazy(() => import("./pages/ImmigrationLanding"));
const Embassies = lazy(() => import("./pages/Embassies"));
const Insurance = lazy(() => import("./pages/Insurance"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const Redirect = lazy(() => import("./pages/Redirect"));

// 404 - lazy load
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MobileNav />
          <Suspense fallback={<PageLoader />}>
            <Routes>
            {/* Critical routes - no lazy loading */}
            <Route path="/" element={<Index />} />
            <Route path="/application" element={<Application />} />
            
            {/* Application flow - lazy loaded */}
            <Route path="/application/manage" element={<ApplicationManager />} />
            <Route path="/application/applicant/:id" element={<ApplicantForm />} />
            <Route path="/application/applicant/:id/documents" element={
              <RouteGuard><ApplicantDocuments /></RouteGuard>
            } />
            <Route path="/application/payment" element={
              <RouteGuard><Payment /></RouteGuard>
            } />
            <Route path="/application/review" element={
              <RouteGuard><Review /></RouteGuard>
            } />
            <Route path="/application/confirmation" element={
              <RouteGuard><Confirmation /></RouteGuard>
            } />
            
            {/* Secondary routes */}
            <Route path="/resume/:token" element={<ResumeApplication />} />
            <Route path="/account" element={<AccountProgress />} />
            <Route path="/track" element={<TrackPolished />} />
            <Route path="/requirements" element={<Requirements />} />
            <Route path="/help" element={<Help />} />
            <Route path="/resources" element={<ResourcesIndex />} />
            <Route path="/resources/:slug" element={<ResourceArticle />} />
            <Route path="/guide" element={<GuideLanding />} />
            <Route path="/immigration" element={<ImmigrationLanding />} />
            <Route path="/embassies" element={<Embassies />} />
            <Route path="/insurance" element={<Insurance />} />
            <Route path="/blog" element={<BlogIndex />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Test route for Phase 1 integration */}
            <Route path="/test-integration" element={<TestIntegration />} />
            
            {/* Dashboard Route */}
            <Route path="/dashboard" element={<DashboardPolished />} />

            {/* Legacy footer links mapping */}
            <Route path="/photo-guide" element={<Redirect to="/resources/uk-eta-photo-requirements-checklist" />} />
            <Route path="/processing" element={<Redirect to="/resources/processing-times-uk-eta-what-to-expect" />} />
            <Route path="/refunds" element={<Redirect to="/resources/refunds-cancellations-uk-eta" />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
