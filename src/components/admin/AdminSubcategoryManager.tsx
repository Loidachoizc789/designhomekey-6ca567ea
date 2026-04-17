import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Edit2, FolderTree, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSubcategories, type Subcategory } from "@/hooks/useSubcategories";

interface Props {
  categorySlug: string;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const AdminSubcategoryManager = ({ categorySlug }: Props) => {
  const { subcategories, loading, refetch } = useSubcategories(categorySlug);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Subcategory | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setName("");
    setSlug("");
    setDialogOpen(true);
  };

  const openEdit = (s: Subcategory) => {
    setEditing(s);
    setName(s.name);
    setSlug(s.slug);
    setDialogOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slug.trim() || slugify(name);
    if (!name.trim() || !finalSlug) {
      toast({ title: "Lỗi", description: "Cần điền tên", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase
          .from("subcategories")
          .update({ name: name.trim(), slug: finalSlug })
          .eq("id", editing.id);
        if (error) throw error;
        toast({ title: "Đã cập nhật danh mục con" });
      } else {
        const { error } = await supabase.from("subcategories").insert({
          category_slug: categorySlug,
          name: name.trim(),
          slug: finalSlug,
          display_order: subcategories.length,
        });
        if (error) throw error;
        toast({ title: "Đã thêm danh mục con" });
      }
      setDialogOpen(false);
      refetch();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Lỗi",
        description: err.message?.includes("duplicate") ? "Slug đã tồn tại" : "Không lưu được",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s: Subcategory) => {
    if (!confirm(`Xóa danh mục con "${s.name}"? Ảnh trong đó sẽ về danh mục cha.`)) return;
    try {
      // Reset ảnh về null (về danh mục cha)
      await supabase
        .from("category_images")
        .update({ subcategory_slug: null })
        .eq("category_slug", categorySlug)
        .eq("subcategory_slug", s.slug);

      const { error } = await supabase.from("subcategories").delete().eq("id", s.id);
      if (error) throw error;
      toast({ title: "Đã xóa danh mục con" });
      refetch();
    } catch (err) {
      console.error(err);
      toast({ title: "Lỗi", description: "Không xóa được", variant: "destructive" });
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= subcategories.length) return;
    const a = subcategories[index];
    const b = subcategories[target];
    try {
      await Promise.all([
        supabase.from("subcategories").update({ display_order: b.display_order }).eq("id", a.id),
        supabase.from("subcategories").update({ display_order: a.display_order }).eq("id", b.id),
      ]);
      refetch();
    } catch (err) {
      console.error(err);
      toast({ title: "Lỗi", description: "Không sắp xếp được", variant: "destructive" });
    }
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-primary" />
          Danh mục con của <span className="text-primary">{categorySlug}</span>
        </h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openAdd}>
              <Plus className="w-4 h-4 mr-1" />
              Thêm
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Sửa danh mục con" : "Thêm danh mục con"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <div className="space-y-2">
                <Label>Tên hiển thị *</Label>
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editing && !slug) setSlug(slugify(e.target.value));
                  }}
                  placeholder="VD: 3D Event"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  placeholder="vd: 3d-event"
                />
                <p className="text-xs text-muted-foreground">Để trống sẽ tự tạo từ tên</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {editing ? "Cập nhật" : "Thêm"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="py-4 text-center">
          <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" />
        </div>
      ) : subcategories.length === 0 ? (
        <p className="text-sm text-muted-foreground py-3">Chưa có danh mục con. Thêm để chia nhỏ ảnh.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {subcategories.map((s, idx) => (
            <div
              key={s.id}
              className="flex items-center gap-1 bg-muted/40 rounded-md px-2 py-1 border border-border"
            >
              <span className="text-sm font-medium">{s.name}</span>
              <span className="text-xs text-muted-foreground">({s.slug})</span>
              <div className="flex items-center gap-0.5 ml-1">
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => move(idx, -1)} disabled={idx === 0}>
                  <ArrowUp className="w-3 h-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => move(idx, 1)}
                  disabled={idx === subcategories.length - 1}
                >
                  <ArrowDown className="w-3 h-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => openEdit(s)}>
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => remove(s)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSubcategoryManager;
