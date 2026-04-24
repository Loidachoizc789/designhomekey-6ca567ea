import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { compressImage } from "@/lib/imageCompression";

type MetaKey = "og_image" | "twitter_image" | "favicon";

const META_FIELDS: { key: MetaKey; label: string; description: string; accept: string; recommended: string }[] = [
  {
    key: "og_image",
    label: "Open Graph Image (og:image)",
    description: "Ảnh hiển thị khi share lên Facebook, Zalo, LinkedIn...",
    accept: "image/*",
    recommended: "1200 x 630px (tỷ lệ 1.91:1)",
  },
  {
    key: "twitter_image",
    label: "Twitter Card Image (twitter:image)",
    description: "Ảnh hiển thị khi share lên Twitter / X",
    accept: "image/*",
    recommended: "1200 x 675px (tỷ lệ 16:9)",
  },
  {
    key: "favicon",
    label: "Favicon (icon trình duyệt)",
    description: "Icon hiển thị trên tab trình duyệt và bookmark",
    accept: "image/png,image/x-icon,image/svg+xml,image/jpeg",
    recommended: "Vuông 512 x 512px (PNG/ICO/SVG)",
  },
];

const AdminMetaImagesManager = () => {
  const [values, setValues] = useState<Record<MetaKey, string>>({
    og_image: "",
    twitter_image: "",
    favicon: "",
  });
  const [loading, setLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState<MetaKey | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("id, value")
        .in("id", ["og_image", "twitter_image", "favicon"]);

      const next: Record<MetaKey, string> = { og_image: "", twitter_image: "", favicon: "" };
      data?.forEach((row: any) => {
        if (row.id in next) next[row.id as MetaKey] = (row.value as any)?.url ?? "";
      });
      setValues(next);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const handleUpload = async (key: MetaKey, file: File) => {
    setUploadingKey(key);
    try {
      // Compress non-favicon images; keep favicon as-is to preserve format
      const fileToUpload =
        key === "favicon"
          ? file
          : (await compressImage(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.85 })).file;
      const ext = fileToUpload.name.split(".").pop() || "png";
      const path = `meta/${key}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("category-images")
        .upload(path, fileToUpload, { upsert: true, contentType: fileToUpload.type });

      if (uploadError) throw uploadError;

      const { data: pub } = supabase.storage.from("category-images").getPublicUrl(path);
      const url = pub.publicUrl;

      const { error: dbError } = await supabase
        .from("site_settings")
        .upsert({ id: key, value: { url }, updated_at: new Date().toISOString() });

      if (dbError) throw dbError;

      setValues((prev) => ({ ...prev, [key]: url }));
      toast({ title: "Đã cập nhật", description: `${key} đã được lưu` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lỗi upload";
      toast({ title: "Lỗi", description: msg, variant: "destructive" });
    } finally {
      setUploadingKey(null);
    }
  };

  const handleRemove = async (key: MetaKey) => {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ id: key, value: { url: "" }, updated_at: new Date().toISOString() });
    if (error) {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
      return;
    }
    setValues((prev) => ({ ...prev, [key]: "" }));
    toast({ title: "Đã xóa", description: `${key} đã được reset` });
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
      <div>
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          Ảnh Meta & Favicon
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Quản lý ảnh xem trước khi share link và icon trình duyệt
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {META_FIELDS.map((field) => {
          const url = values[field.key];
          const isUploading = uploadingKey === field.key;
          return (
            <div key={field.key} className="space-y-3 p-4 rounded-xl border border-border bg-card/50">
              <div>
                <Label className="text-sm font-semibold">{field.label}</Label>
                <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
                <p className="text-xs text-primary/80 mt-1">Khuyến nghị: {field.recommended}</p>
              </div>

              <div className="aspect-video w-full rounded-lg border border-dashed border-border bg-muted/30 flex items-center justify-center overflow-hidden">
                {url ? (
                  <img src={url} alt={field.label} className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-muted-foreground/40" />
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  disabled={isUploading}
                >
                  <label className="cursor-pointer">
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    {url ? "Thay" : "Tải lên"}
                    <input
                      type="file"
                      accept={field.accept}
                      className="hidden"
                      disabled={isUploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(field.key, file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </Button>
                {url && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemove(field.key)}
                    disabled={isUploading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminMetaImagesManager;
