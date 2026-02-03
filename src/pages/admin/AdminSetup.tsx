import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AdminSetup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [hasAdmin, setHasAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingAdmin = async () => {
      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("id")
          .eq("role", "admin")
          .limit(1);

        if (error) throw error;
        setHasAdmin(data && data.length > 0);
      } catch (err) {
        console.error("Error checking admin:", err);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkExistingAdmin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu phải có ít nhất 6 ký tự",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Add admin role
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: authData.user.id,
            role: "admin",
          });

        if (roleError) throw roleError;

        toast({
          title: "Thành công",
          description: "Tài khoản admin đã được tạo. Vui lòng kiểm tra email để xác nhận.",
        });
        
        navigate("/admin/login");
      }
    } catch (err: unknown) {
      console.error("Setup error:", err);
      toast({
        title: "Lỗi",
        description: err instanceof Error ? err.message : "Đã xảy ra lỗi khi tạo tài khoản",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (hasAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Admin Đã Tồn Tại</h1>
          <p className="text-muted-foreground mb-6">
            Hệ thống đã có tài khoản admin. Vui lòng đăng nhập.
          </p>
          <Button onClick={() => navigate("/admin/login")} className="w-full">
            Đến trang đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="glass-card p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <img
            src="/lovable-uploads/1052d8d6-1118-4206-be15-c73ee5a0188e.png"
            alt="DesignHomeKey"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="font-display text-2xl font-bold">Tạo Tài Khoản Admin</h1>
          <p className="text-muted-foreground mt-2">
            Đây là lần setup đầu tiên. Tạo tài khoản admin để quản lý website.
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Tạo tài khoản Admin
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminSetup;
