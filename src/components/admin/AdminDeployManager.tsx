import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Rocket, Loader2, ExternalLink, AlertCircle } from "lucide-react";

const AdminDeployManager = () => {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    message: string;
    actionsUrl?: string;
  } | null>(null);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("trigger-deploy", {
        body: { password },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setLastResult({
        success: true,
        message: data.message,
        actionsUrl: data.actionsUrl,
      });
      toast({
        title: "🚀 Đã kích hoạt deploy",
        description: "Site sẽ cập nhật trong 1-2 phút.",
      });
      setPassword("");
      setOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lỗi không xác định";
      setLastResult({ success: false, message: msg });
      toast({
        title: "Deploy thất bại",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[250px]">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            Đồng bộ website live
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Cập nhật code mới nhất lên{" "}
            <a
              href="https://designhomeke.online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              designhomeke.online
            </a>
            . Yêu cầu nhập lại mật khẩu admin để xác nhận.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Rocket className="w-4 h-4" />
          Đồng bộ ngay
        </Button>
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-md">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Lưu ý:</strong> Nội dung quản lý (ảnh, giá, danh mục...) đã đồng
          bộ tự động không cần deploy. Chỉ deploy khi có thay đổi giao diện/tính
          năng từ Lovable.
        </div>
      </div>

      {lastResult && (
        <div
          className={`p-3 rounded-md text-sm ${
            lastResult.success
              ? "bg-primary/10 text-primary"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          <div>{lastResult.message}</div>
          {lastResult.actionsUrl && (
            <a
              href={lastResult.actionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 hover:underline"
            >
              Xem tiến trình deploy <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận đồng bộ website</DialogTitle>
            <DialogDescription>
              Nhập mật khẩu admin để xác nhận deploy lên designhomeke.online
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDeploy} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deploy-password">Mật khẩu admin</Label>
              <Input
                id="deploy-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading || !password}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Xác nhận deploy
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDeployManager;
