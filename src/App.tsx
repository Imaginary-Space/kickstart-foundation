import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { lazy, Suspense } from "react";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const TestimonialsPage = lazy(() => import("./pages/Testimonials"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Styleguide = lazy(() => import("./pages/Styleguide"));
const NameGenerator = lazy(() => import("./pages/NameGenerator"));
const Docs = lazy(() => import("./pages/Docs"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

// Loading component for Suspense fallbacks
const PageSkeleton = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <ErrorBoundary>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  </Suspense>
                } />
                <Route path="/onboarding" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <ProtectedRoute>
                      <Onboarding />
                    </ProtectedRoute>
                  </Suspense>
                } />
                <Route path="/login" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Login />
                  </Suspense>
                } />
                <Route path="/styleguide" element={<Styleguide />} />
                <Route path="/docs" element={<Docs />} />
                <Route path="/admin" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  </Suspense>
                } />
                <Route path="/testimonials" element={<TestimonialsPage />} />
                <Route path="/name-generator" element={<NameGenerator />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
