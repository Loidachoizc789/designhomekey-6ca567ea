import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Check if user is admin
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", authData.user.id)
          .eq("role", "admin")
          .single();

        if (roleError || !roleData) {
          await supabase.auth.signOut();
          throw new Error("Bạn không có quyền truy cập admin");
        }

        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn đến trang quản trị",
        });

        navigate("/admin");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      toast({
        title: "Lỗi đăng nhập",
        description: err instanceof Error ? err.message : "Email hoặc mật khẩu không đúng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="glass-card p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <img
            src="/lovable-uploads/1052d8d6-1118-4206-be15-c73ee5a0188e.png"
            alt="DesignHomeKey"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="font-display text-2xl font-bold">Đăng Nhập Admin</h1>
          <p className="text-muted-foreground mt-2">
            Đăng nhập để quản lý nội dung website
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Đăng nhập
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Button variant="link" className="p-0" onClick={() => navigate("/admin/setup")}>
              Tạo admin đầu tiên
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
