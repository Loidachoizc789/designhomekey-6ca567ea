import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Design2D from "./pages/Design2D";
import Studio3D from "./pages/Studio3D";
import Model3D from "./pages/Model3D";
import InteriorExterior from "./pages/InteriorExterior";
import MotionGraphics from "./pages/MotionGraphics";
import AdminSetup from "./pages/admin/AdminSetup";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
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
          <Route path="/thiet-ke-2d" element={<Design2D />} />
          <Route path="/phim-truong-3d" element={<Studio3D />} />
          <Route path="/model-3d" element={<Model3D />} />
          <Route path="/noi-ngoai-that" element={<InteriorExterior />} />
          <Route path="/motion-graphics" element={<MotionGraphics />} />
          <Route path="/admin/setup" element={<AdminSetup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
