import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload, Save, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  home_image_url: string | null;
  display_order: number;
}

const CATEGORIES = [
  { slug: "thiet-ke-2d", name: "Thiết Kế 2D" },
  { slug: "phim-truong-3d", name: "Phim Trường 3D" },
  { slug: "model-3d", name: "Model 3D" },
  { slug: "noi-ngoai-that", name: "Nội Ngoại Thất" },
  { slug: "after-effects", name: "After Effects" },
];

const AdminHomepageManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      
      // If no categories exist, create default ones
      if (!data || data.length === 0) {
        await createDefaultCategories();
        return;
      }
      
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách danh mục",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultCategories = async () => {
    try {
      const defaultCategories = CATEGORIES.map((cat, index) => ({
        name: cat.name,
        slug: cat.slug,
        description: null,
        home_image_url: null,
        display_order: index,
      }));

      const { error } = await supabase.from("categories").insert(defaultCategories);
      if (error) throw error;
      
      fetchCategories();
    } catch (err) {
      console.error("Error creating default categories:", err);
    }
  };

  const handleFileUpload = async (categoryId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "File quá lớn. Tối đa 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(categoryId);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `homepage/${categoryId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("category-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("category-images")
        .getPublicUrl(fileName);

      // Update category with new image URL
      const { error: updateError } = await supabase
        .from("categories")
        .update({ home_image_url: urlData.publicUrl })
        .eq("id", categoryId);

      if (updateError) throw updateError;

      toast({ title: "Đã upload và cập nhật ảnh" });
      fetchCategories();
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

  const handleRemoveImage = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from("categories")
        .update({ home_image_url: null })
        .eq("id", categoryId);

      if (error) throw error;
      toast({ title: "Đã xóa ảnh" });
      fetchCategories();
    } catch (err) {
      console.error("Remove error:", err);
      toast({
        title: "Lỗi",
        description: "Không thể xóa ảnh",
        variant: "destructive",
      });
    }
  };

  const handleUpdateDescription = async (categoryId: string, description: string) => {
    try {
      const { error } = await supabase
        .from("categories")
        .update({ description })
        .eq("id", categoryId);

      if (error) throw error;
      
      setCategories(prev => 
        prev.map(cat => 
          cat.id === categoryId ? { ...cat, description } : cat
        )
      );
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">
          Quản lý ảnh trang chủ
        </h2>
      </div>

      <p className="text-muted-foreground">
        Cập nhật ảnh đại diện cho từng danh mục hiển thị trên trang chủ
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="glass-card overflow-hidden">
            {/* Image */}
            <div className="relative aspect-video bg-card">
              {category.home_image_url ? (
                <>
                  <img
                    src={category.home_image_url}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveImage(category.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(category.id, e)}
                    className="hidden"
                    id={`upload-${category.id}`}
                    disabled={uploading === category.id}
                  />
                  <label
                    htmlFor={`upload-${category.id}`}
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    {uploading === category.id ? (
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Click để upload
                        </span>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-primary">{category.name}</h3>
              <p className="text-xs text-muted-foreground">Slug: {category.slug}</p>
              
              <div className="space-y-2">
                <Label className="text-xs">Mô tả (hiển thị trên trang chủ)</Label>
                <Input
                  value={category.description || ""}
                  onChange={(e) => handleUpdateDescription(category.id, e.target.value)}
                  placeholder="Mô tả ngắn..."
                  className="text-sm"
                />
              </div>

              {category.home_image_url && (
                <div className="pt-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(category.id, e)}
                    className="hidden"
                    id={`replace-${category.id}`}
                    disabled={uploading === category.id}
                  />
                  <label htmlFor={`replace-${category.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <span>
                        {uploading === category.id ? (
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

export default AdminHomepageManager;
