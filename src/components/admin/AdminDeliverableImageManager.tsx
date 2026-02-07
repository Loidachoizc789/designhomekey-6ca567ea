import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload, X, Image } from "lucide-react";

interface CategoryPageImage {
  id: string;
  category_slug: string;
  section_key: string;
  image_url: string | null;
}

const CATEGORY_SECTIONS = [
  { slug: "thiet-ke-2d", name: "Thiết Kế 2D", section: "deliverables" },
  { slug: "phim-truong-3d", name: "Thiết Kế 3D", section: "deliverables" },
  { slug: "model-3d", name: "Model 3D / Asset", section: "deliverables" },
  { slug: "noi-ngoai-that", name: "Nội Ngoại Thất", section: "deliverables" },
  { slug: "after-effects", name: "After Effects", section: "deliverables" },
];

const AdminDeliverableImageManager = () => {
  const [images, setImages] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from("category_page_images")
        .select("*")
        .eq("section_key", "deliverables");

      if (error) throw error;

      const imageMap: Record<string, string | null> = {};
      data?.forEach((item: CategoryPageImage) => {
        imageMap[item.category_slug] = item.image_url;
      });
      setImages(imageMap);
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (slug: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "File quá lớn. Tối đa 50MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(slug);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `deliverables/${slug}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("category-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("category-images")
        .getPublicUrl(fileName);

      // Upsert the image record
      const { error: upsertError } = await supabase
        .from("category_page_images")
        .upsert({
          category_slug: slug,
          section_key: "deliverables",
          image_url: urlData.publicUrl,
        }, { onConflict: "category_slug,section_key" });

      if (upsertError) throw upsertError;

      toast({ title: "Đã cập nhật ảnh thành công" });
      fetchImages();
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        title: "Lỗi upload",
        description: "Không thể upload ảnh",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const handleRemove = async (slug: string) => {
    try {
      const { error } = await supabase
        .from("category_page_images")
        .delete()
        .eq("category_slug", slug)
        .eq("section_key", "deliverables");

      if (error) throw error;
      toast({ title: "Đã xóa ảnh" });
      fetchImages();
    } catch (err) {
      console.error("Remove error:", err);
      toast({
        title: "Lỗi",
        description: "Không thể xóa ảnh",
        variant: "destructive",
      });
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
      <div className="flex items-center gap-3">
        <Image className="w-5 h-5 text-primary" />
        <h2 className="font-display text-xl font-semibold">Ảnh Sản Phẩm Bàn Giao</h2>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Cập nhật ảnh hiển thị trong phần "Sản Phẩm Bàn Giao" cho từng danh mục
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORY_SECTIONS.map((cat) => (
          <div key={cat.slug} className="border border-border rounded-lg overflow-hidden">
            <div className="aspect-video bg-card relative">
              {images[cat.slug] ? (
                <>
                  <img
                    src={images[cat.slug]!}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemove(cat.slug)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpload(cat.slug, e)}
                    className="hidden"
                    id={`deliverable-${cat.slug}`}
                    disabled={uploading === cat.slug}
                  />
                  <label
                    htmlFor={`deliverable-${cat.slug}`}
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    {uploading === cat.slug ? (
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click để upload</span>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-primary">{cat.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">Phần: Sản Phẩm Bàn Giao</p>
              
              {images[cat.slug] && (
                <div className="mt-3">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpload(cat.slug, e)}
                    className="hidden"
                    id={`replace-deliverable-${cat.slug}`}
                    disabled={uploading === cat.slug}
                  />
                  <label htmlFor={`replace-deliverable-${cat.slug}`}>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <span>
                        {uploading === cat.slug ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        Thay đổi ảnh
                      </span>
                    </Button>
                  </label>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDeliverableImageManager;
