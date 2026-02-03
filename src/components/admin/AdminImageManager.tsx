import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Edit2, Upload, X, GripVertical, Video, Image } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CategoryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  display_order: number;
  category_slug: string;
}

interface AdminImageManagerProps {
  categorySlug: string;
}

const AdminImageManager = ({ categorySlug }: AdminImageManagerProps) => {
  const [images, setImages] = useState<CategoryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<CategoryImage | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    fetchImages();
  }, [categorySlug]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("category_images")
        .select("*")
        .eq("category_slug", categorySlug)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      console.error("Error fetching images:", err);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách ảnh",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "File quá lớn. Tối đa 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${categorySlug}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("category-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("category-images")
        .getPublicUrl(fileName);

      setFormData({ ...formData, image_url: urlData.publicUrl });
      toast({
        title: "Thành công",
        description: "Đã upload ảnh",
      });
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        title: "Lỗi upload",
        description: "Không thể upload ảnh",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.image_url) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền tiêu đề và upload ảnh",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingImage) {
        // Update existing
        const { error } = await supabase
          .from("category_images")
          .update({
            title: formData.title,
            description: formData.description || null,
            image_url: formData.image_url,
          })
          .eq("id", editingImage.id);

        if (error) throw error;
        toast({ title: "Đã cập nhật ảnh" });
      } else {
        // Create new
        const { error } = await supabase.from("category_images").insert({
          title: formData.title,
          description: formData.description || null,
          image_url: formData.image_url,
          category_slug: categorySlug,
          display_order: images.length,
        });

        if (error) throw error;
        toast({ title: "Đã thêm ảnh mới" });
      }

      setDialogOpen(false);
      setEditingImage(null);
      setFormData({ title: "", description: "", image_url: "" });
      fetchImages();
    } catch (err) {
      console.error("Save error:", err);
      toast({
        title: "Lỗi",
        description: "Không thể lưu ảnh",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (image: CategoryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description || "",
      image_url: image.image_url,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa ảnh này?")) return;

    try {
      const { error } = await supabase
        .from("category_images")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Đã xóa ảnh" });
      fetchImages();
    } catch (err) {
      console.error("Delete error:", err);
      toast({
        title: "Lỗi",
        description: "Không thể xóa ảnh",
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setEditingImage(null);
    setFormData({ title: "", description: "", image_url: "" });
    setDialogOpen(true);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">
          Ảnh danh mục: <span className="text-primary">{categorySlug}</span>
        </h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm ảnh
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? "Chỉnh sửa ảnh" : "Thêm ảnh mới"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Tiêu đề *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Tên sản phẩm/ảnh"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả ngắn về sản phẩm"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Ảnh *</Label>
                {formData.image_url ? (
                  <div className="relative">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        setFormData({ ...formData, image_url: "" })
                      }
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      {uploading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Click để upload (max 10MB)
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Hoặc dán URL ảnh trực tiếp:
                </p>
                <Input
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">
                  {editingImage ? "Cập nhật" : "Thêm"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Chưa có ảnh nào trong danh mục này</p>
          <Button className="mt-4" onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm ảnh đầu tiên
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="glass-card overflow-hidden group"
            >
              <div className="relative aspect-video">
                {image.image_url.includes(".mp4") || image.image_url.includes(".webm") ? (
                  <div className="w-full h-full bg-card flex items-center justify-center">
                    <Video className="w-12 h-12 text-muted-foreground" />
                  </div>
                ) : (
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(image)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(image.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm truncate">{image.title}</h3>
                {image.description && (
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {image.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminImageManager;
