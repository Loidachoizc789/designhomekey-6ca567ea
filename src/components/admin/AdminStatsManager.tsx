import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

interface HomepageStat {
  id: string;
  stat_key: string;
  stat_value: string;
  stat_label: string;
  display_order: number;
}

const AdminStatsManager = () => {
  const [stats, setStats] = useState<HomepageStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from("homepage_stats")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setStats(data || []);
    } catch (err) {
      console.error("Error fetching stats:", err);
      toast({
        title: "Lỗi",
        description: "Không thể tải thống kê",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleChange = (id: string, field: "stat_value" | "stat_label", value: string) => {
    setStats((prev) =>
      prev.map((stat) => (stat.id === id ? { ...stat, [field]: value } : stat))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const stat of stats) {
        const { error } = await supabase
          .from("homepage_stats")
          .update({
            stat_value: stat.stat_value,
            stat_label: stat.stat_label,
          })
          .eq("id", stat.id);

        if (error) throw error;
      }

      toast({
        title: "Thành công",
        description: "Đã cập nhật thống kê",
      });
    } catch (err) {
      console.error("Error saving stats:", err);
      toast({
        title: "Lỗi",
        description: "Không thể lưu thống kê",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Thống kê Hero Section</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Lưu thay đổi
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.id} className="space-y-4 p-4 rounded-lg bg-card/50 border border-border">
            <div>
              <Label className="text-xs text-muted-foreground uppercase">Key</Label>
              <p className="text-sm font-medium text-primary">{stat.stat_key}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`value-${stat.id}`}>Giá trị</Label>
              <Input
                id={`value-${stat.id}`}
                value={stat.stat_value}
                onChange={(e) => handleChange(stat.id, "stat_value", e.target.value)}
                placeholder="500+"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`label-${stat.id}`}>Nhãn</Label>
              <Input
                id={`label-${stat.id}`}
                value={stat.stat_label}
                onChange={(e) => handleChange(stat.id, "stat_label", e.target.value)}
                placeholder="ASSET 3D"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStatsManager;
