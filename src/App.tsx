import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RouteScrollToTop from "@/components/RouteScrollToTop";

// Critical: Load Index immediately for fast LCP
import Index from "./pages/Index";

// Lazy load other pages for code splitting
const Design2D = lazy(() => import("./pages/Design2D"));
const Studio3D = lazy(() => import("./pages/Studio3D"));
const Model3D = lazy(() => import("./pages/Model3D"));
const InteriorExterior = lazy(() => import("./pages/InteriorExterior"));
const MotionGraphics = lazy(() => import("./pages/MotionGraphics"));
const AdminSetup = lazy(() => import("./pages/admin/AdminSetup"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Minimal loading spinner for route transitions
const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteScrollToTop />
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/thiet-ke-2d" element={<Design2D />} />
            <Route path="/phim-truong-3d" element={<Studio3D />} />
            <Route path="/model-3d" element={<Model3D />} />
            <Route path="/noi-ngoai-that" element={<InteriorExterior />} />
            <Route path="/motion-graphics" element={<MotionGraphics />} />
            {/* Alias để slug DB khớp URL */}
            <Route path="/after-effects" element={<MotionGraphics />} />
            <Route path="/admin/setup" element={<AdminSetup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
