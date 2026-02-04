import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Loader2, LogOut, Image, DollarSign, Home, Gift, BarChart3, Package } from "lucide-react";
import AdminImageManager from "@/components/admin/AdminImageManager";
import AdminPricingManager from "@/components/admin/AdminPricingManager";
import AdminHomepageManager from "@/components/admin/AdminHomepageManager";
import AdminComboManager from "@/components/admin/AdminComboManager";
import AdminStatsManager from "@/components/admin/AdminStatsManager";
import AdminDeliverableImageManager from "@/components/admin/AdminDeliverableImageManager";

const CATEGORY_SLUGS = [
  { slug: "thiet-ke-2d", name: "Thiết Kế 2D" },
  { slug: "3d-virtual", name: "3D Virtual" },
  { slug: "3d-event", name: "3D Event" },
  { slug: "model-3d", name: "Model 3D" },
  { slug: "noi-that", name: "Nội Thất" },
  { slug: "ngoai-that", name: "Ngoại Thất" },
  { slug: "after-effects", name: "After Effects" },
];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_SLUGS[0].slug);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/admin/login");
          return;
        }

        // Check if user is admin
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .single();

        if (roleError || !roleData) {
          toast({
            title: "Không có quyền truy cập",
            description: "Bạn không phải là admin",
            variant: "destructive",
          });
          navigate("/admin/login");
          return;
        }

        setIsAdmin(true);
      } catch (err) {
        console.error("Auth check error:", err);
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <img
                src="/lovable-uploads/1052d8d6-1118-4206-be15-c73ee5a0188e.png"
                alt="DesignHomeKey"
                className="h-8"
              />
              <h1 className="font-display text-lg font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/")} size="sm">
                Xem website
              </Button>
              <Button variant="outline" onClick={handleLogout} size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="images" className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Ảnh
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Bảng giá
            </TabsTrigger>
            <TabsTrigger value="combo" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Combo
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Thống kê
            </TabsTrigger>
            <TabsTrigger value="homepage" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Trang chủ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="space-y-6">
            {/* Category Selector */}
            <div className="glass-card p-4">
              <h2 className="font-semibold mb-3">Chọn danh mục</h2>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_SLUGS.map((cat) => (
                  <Button
                    key={cat.slug}
                    variant={selectedCategory === cat.slug ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.slug)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Image Manager */}
            <AdminImageManager categorySlug={selectedCategory} />
          </TabsContent>

          <TabsContent value="pricing">
            <AdminPricingManager />
          </TabsContent>

          <TabsContent value="combo">
            <AdminComboManager />
          </TabsContent>

          <TabsContent value="stats">
            <AdminStatsManager />
          </TabsContent>

          <TabsContent value="homepage" className="space-y-6">
            <AdminHomepageManager />
            <AdminDeliverableImageManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
