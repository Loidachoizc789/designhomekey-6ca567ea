import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Loader2, Trash2, Upload, Plus } from "lucide-react";

interface Banner {
  id: string;
  image_url: string;
  title: string;
  link_url: string;
  display_order: number;
  is_active: boolean;
}

const AdminBannerManager = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchBanners = async () => {
    const { data } = await supabase
      .from("homepage_banners")
      .select("*")
      .order("display_order");
    if (data) setBanners(data);
    setLoading(false);
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const filePath = `banners/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("homepage-assets")
      .upload(filePath, file);

    if (uploadError) {
      toast({ title: "Lỗi upload", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("homepage-assets")
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase
      .from("homepage_banners")
      .insert({
        image_url: urlData.publicUrl,
        title: "",
        link_url: "",
        display_order: banners.length,
        is_active: true,
      });

    if (insertError) {
      toast({ title: "Lỗi", description: insertError.message, variant: "destructive" });
    } else {
      toast({ title: "Đã thêm banner" });
      fetchBanners();
    }
    setUploading(false);
  };

  const handleAddUrl = async () => {
    const url = prompt("Nhập URL ảnh banner:");
    if (!url) return;

    const { error } = await supabase.from("homepage_banners").insert({
      image_url: url,
      title: "",
      link_url: "",
      display_order: banners.length,
      is_active: true,
    });

    if (!error) {
      toast({ title: "Đã thêm banner" });
      fetchBanners();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa banner này?")) return;
    await supabase.from("homepage_banners").delete().eq("id", id);
    toast({ title: "Đã xóa" });
    fetchBanners();
  };

  const handleUpdate = async (id: string, field: string, value: string | boolean) => {
    await supabase.from("homepage_banners").update({ [field]: value, updated_at: new Date().toISOString() }).eq("id", id);
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  const handleToggle = async (id: string, current: boolean) => {
    await handleUpdate(id, "is_active", !current);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Quản lý Banner Slider</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleAddUrl}>
            <Plus className="w-4 h-4 mr-1" />
            Thêm URL
          </Button>
          <label>
            <Button variant="default" size="sm" asChild disabled={uploading}>
              <span className="cursor-pointer">
                {uploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
                Upload ảnh
              </span>
            </Button>
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </div>

      {banners.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">
          Chưa có banner nào. Thêm ảnh banner để hiển thị trên trang chủ.
        </p>
      ) : (
        <div className="space-y-4">
          {banners.map((banner, idx) => (
            <div key={banner.id} className="flex items-start gap-4 p-4 border border-border rounded-lg bg-card/50">
              <div className="flex-shrink-0 w-48 aspect-[4/1] rounded overflow-hidden bg-muted">
                <img src={banner.image_url} alt={banner.title || `Banner ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Tiêu đề (tùy chọn)"
                  value={banner.title}
                  onChange={(e) => handleUpdate(banner.id, "title", e.target.value)}
                  className="h-8 text-sm"
                />
                <Input
                  placeholder="Link URL (tùy chọn)"
                  value={banner.link_url}
                  onChange={(e) => handleUpdate(banner.id, "link_url", e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Hiện</span>
                  <Switch checked={banner.is_active} onCheckedChange={() => handleToggle(banner.id, banner.is_active)} />
                </div>
                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(banner.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBannerManager;
