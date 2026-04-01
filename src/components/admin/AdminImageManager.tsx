import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Edit2, Upload, X, Video, Image as ImageIcon, Images, GripVertical, CheckSquare, Square } from "lucide-react";
import { compressImage, formatBytes } from "@/lib/imageCompression";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductMediaManager from "./ProductMediaManager";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

interface SortableImageItemProps {
  image: CategoryImage;
  index: number;
  selectMode: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onEdit: (image: CategoryImage) => void;
  onDelete: (id: string) => void;
  onOpenMedia: (image: CategoryImage) => void;
}

const SortableImageItem = ({ image, index, selectMode, selectedIds, onToggleSelect, onEdit, onDelete, onOpenMedia }: SortableImageItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
    opacity: isDragging ? 0.3 : 1,
    scale: isDragging ? '0.95' : '1',
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass-card overflow-hidden group transition-all ${
        selectMode && selectedIds.has(image.id) ? "ring-2 ring-primary" : ""
      }`}
      onClick={selectMode ? () => onToggleSelect(image.id) : undefined}
    >
      <div className="relative aspect-video">
        {selectMode && (
          <div className="absolute top-2 left-2 z-10">
            <div className={`w-6 h-6 rounded flex items-center justify-center ${selectedIds.has(image.id) ? "bg-primary text-primary-foreground" : "bg-background/80 text-foreground"}`}>
              {selectedIds.has(image.id) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded bg-background/80 flex items-center justify-center text-xs font-medium">
          {index + 1}
        </div>

        {image.image_url.match(/\.(mp4|webm|mov)$/i) ? (
          <div className="w-full h-full bg-card flex items-center justify-center"><Video className="w-12 h-12 text-muted-foreground" /></div>
        ) : (
          <img src={image.image_url} alt={image.title} className="w-full h-full object-cover" />
        )}

        {!selectMode && (
          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-2 rounded bg-secondary text-secondary-foreground hover:bg-secondary/80"
              title="Kéo để sắp xếp"
            >
              <GripVertical className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="secondary" onClick={() => onEdit(image)}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="default" onClick={() => onOpenMedia(image)}>
                <Images className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(image.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm truncate">{image.title}</h3>
          <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={(e) => { e.stopPropagation(); onOpenMedia(image); }}>
            <Images className="w-3 h-3 mr-1" />Media
          </Button>
        </div>
        {image.description && <p className="text-xs text-muted-foreground truncate mt-1">{image.description}</p>}
      </div>
    </div>
  );
};

const AdminImageManager = ({ categorySlug }: AdminImageManagerProps) => {
  const [images, setImages] = useState<CategoryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CategoryImage | null>(null);
  const [editingImage, setEditingImage] = useState<CategoryImage | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", image_url: "" });
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => { fetchImages(); }, [categorySlug]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("category_images").select("*").eq("category_slug", categorySlug).order("display_order", { ascending: true });
      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      console.error("Error fetching images:", err);
      toast({ title: "Lỗi", description: "Không thể tải danh sách ảnh", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);
    const newImages = arrayMove(images, oldIndex, newIndex);
    setImages(newImages);

    try {
      const updates = newImages.map((item, i) =>
        supabase.from("category_images").update({ display_order: i }).eq("id", item.id)
      );
      await Promise.all(updates);
    } catch (err) {
      console.error("Reorder error:", err);
      toast({ title: "Lỗi", description: "Không thể sắp xếp lại", variant: "destructive" });
      fetchImages();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024 * 1024) {
      toast({ title: "Lỗi", description: "File quá lớn. Tối đa 500MB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const uploadFile = compressed.file;
      const fileExt = uploadFile.name.split(".").pop();
      const fileName = `${categorySlug}/${Date.now()}.${fileExt}`;
      if (compressed.wasCompressed) {
        toast({ title: "Đã nén ảnh", description: `${formatBytes(compressed.originalSize)} → ${formatBytes(compressed.compressedSize)} (giảm ${Math.round((1 - compressed.compressedSize / compressed.originalSize) * 100)}%)` });
      }
      const { error: uploadError } = await supabase.storage.from("category-images").upload(fileName, uploadFile);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("category-images").getPublicUrl(fileName);
      setFormData({ ...formData, image_url: urlData.publicUrl });
      toast({ title: "Thành công", description: "Đã upload ảnh" });
    } catch (err) {
      console.error("Upload error:", err);
      toast({ title: "Lỗi upload", description: "Không thể upload ảnh", variant: "destructive" });
    } finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image_url) {
      toast({ title: "Lỗi", description: "Vui lòng điền tiêu đề và upload ảnh", variant: "destructive" });
      return;
    }
    try {
      if (editingImage) {
        const { error } = await supabase.from("category_images").update({ title: formData.title, description: formData.description || null, image_url: formData.image_url }).eq("id", editingImage.id);
        if (error) throw error;
        toast({ title: "Đã cập nhật ảnh" });
      } else {
        const { error } = await supabase.from("category_images").insert({ title: formData.title, description: formData.description || null, image_url: formData.image_url, category_slug: categorySlug, display_order: images.length });
        if (error) throw error;
        toast({ title: "Đã thêm ảnh mới" });
      }
      setDialogOpen(false);
      setEditingImage(null);
      setFormData({ title: "", description: "", image_url: "" });
      fetchImages();
    } catch (err) {
      console.error("Save error:", err);
      toast({ title: "Lỗi", description: "Không thể lưu ảnh", variant: "destructive" });
    }
  };

  const handleEdit = (image: CategoryImage) => {
    setEditingImage(image);
    setFormData({ title: image.title, description: image.description || "", image_url: image.image_url });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa ảnh này?")) return;
    try {
      const { error } = await supabase.from("category_images").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Đã xóa ảnh" });
      fetchImages();
    } catch (err) {
      console.error("Delete error:", err);
      toast({ title: "Lỗi", description: "Không thể xóa ảnh", variant: "destructive" });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Xóa ${selectedIds.size} sản phẩm đã chọn?`)) return;
    try {
      const { error } = await supabase.from("category_images").delete().in("id", Array.from(selectedIds));
      if (error) throw error;
      toast({ title: `Đã xóa ${selectedIds.size} sản phẩm` });
      setSelectedIds(new Set());
      setSelectMode(false);
      fetchImages();
    } catch (err) {
      console.error("Bulk delete error:", err);
      toast({ title: "Lỗi", description: "Không thể xóa", variant: "destructive" });
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === images.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(images.map(img => img.id)));
  };

  const openAddDialog = () => {
    setEditingImage(null);
    setFormData({ title: "", description: "", image_url: "" });
    setDialogOpen(true);
  };

  const openMediaManager = (product: CategoryImage) => {
    setSelectedProduct(product);
    setMediaDialogOpen(true);
  };

  if (loading) {
    return <div className="glass-card p-8 text-center"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-display text-xl font-semibold">
          Ảnh danh mục: <span className="text-primary">{categorySlug}</span>
        </h2>
        <div className="flex items-center gap-2">
          {images.length > 0 && (
            <>
              <Button size="sm" variant={selectMode ? "default" : "outline"} onClick={() => { setSelectMode(!selectMode); if (selectMode) setSelectedIds(new Set()); }}>
                <CheckSquare className="w-4 h-4 mr-1" />{selectMode ? "Hủy chọn" : "Chọn nhiều"}
              </Button>
              {selectMode && (
                <>
                  <Button size="sm" variant="outline" onClick={toggleSelectAll}>{selectedIds.size === images.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}</Button>
                  <Button size="sm" variant="destructive" onClick={handleBulkDelete} disabled={selectedIds.size === 0}><Trash2 className="w-4 h-4 mr-1" />Xóa ({selectedIds.size})</Button>
                </>
              )}
            </>
          )}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}><Plus className="w-4 h-4 mr-2" />Thêm sản phẩm</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingImage ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Tiêu đề *</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Tên sản phẩm/ảnh" required />
                </div>
                <div className="space-y-2">
                  <Label>Mô tả</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Mô tả ngắn về sản phẩm" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Ảnh đại diện *</Label>
                  {formData.image_url ? (
                    <div className="relative">
                      {formData.image_url.match(/\.(mp4|webm|mov)$/i) ? (
                        <div className="w-full h-48 bg-card flex items-center justify-center rounded-lg"><Video className="w-12 h-12 text-muted-foreground" /></div>
                      ) : (
                        <img src={formData.image_url} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      )}
                      <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => setFormData({ ...formData, image_url: "" })}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" id="file-upload" disabled={uploading} />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        {uploading ? <Loader2 className="w-8 h-8 animate-spin text-primary" /> : (
                          <><Upload className="w-8 h-8 text-muted-foreground" /><span className="text-sm text-muted-foreground">Click để upload (max 500MB)</span></>
                        )}
                      </label>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">Hoặc dán URL ảnh trực tiếp:</p>
                  <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
                  <Button type="submit">{editingImage ? "Cập nhật" : "Thêm"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Chưa có ảnh nào trong danh mục này</p>
          <Button className="mt-4" onClick={openAddDialog}><Plus className="w-4 h-4 mr-2" />Thêm sản phẩm đầu tiên</Button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map(img => img.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <SortableImageItem
                  key={image.id}
                  image={image}
                  index={index}
                  selectMode={selectMode}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelect}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onOpenMedia={openMediaManager}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Media Manager Dialog */}
      <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Images className="w-5 h-5 text-primary" />
              Quản lý Media: {selectedProduct?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && <ProductMediaManager productId={selectedProduct.id} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminImageManager;
