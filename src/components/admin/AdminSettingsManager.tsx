import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";

const AdminSettingsManager = () => {
  const [pricingVisible, setPricingVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("id", "pricing_visible")
        .maybeSingle();
      if (data?.value) {
        setPricingVisible((data.value as any).enabled !== false);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const togglePricing = async (enabled: boolean) => {
    setSaving(true);
    setPricingVisible(enabled);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ id: "pricing_visible", value: { enabled }, updated_at: new Date().toISOString() });
    
    if (error) {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
      setPricingVisible(!enabled);
    } else {
      toast({ title: enabled ? "Đã hiện Bảng Giá" : "Đã ẩn Bảng Giá", description: "Thay đổi có hiệu lực ngay lập tức" });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="glass-card p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="font-display text-xl font-bold">Cài đặt hiển thị</h2>
      
      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
        <div className="flex items-center gap-3">
          {pricingVisible ? (
            <Eye className="w-5 h-5 text-primary" />
          ) : (
            <EyeOff className="w-5 h-5 text-muted-foreground" />
          )}
          <div>
            <Label className="text-base font-medium">Bảng Giá trên trang chủ</Label>
            <p className="text-sm text-muted-foreground">
              {pricingVisible ? "Đang hiển thị" : "Đang ẩn"} mục Bảng Giá & Combo trên trang chủ
            </p>
          </div>
        </div>
        <Switch
          checked={pricingVisible}
          onCheckedChange={togglePricing}
          disabled={saving}
        />
      </div>
    </div>
  );
};

export default AdminSettingsManager;
