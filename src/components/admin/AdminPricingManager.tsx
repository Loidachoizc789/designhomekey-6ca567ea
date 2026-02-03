import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Edit2, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PricingItem {
  label: string;
  price: string;
}

interface CategoryPricing {
  id: string;
  service_name: string;
  items: PricingItem[];
  display_order: number;
  category_slug: string;
}

interface PricingNotes {
  id?: string;
  includes: string[];
  excludes: string[];
  category_slug: string;
}

const CATEGORY_SLUGS = [
  { slug: "thiet-ke-2d", name: "Thiết Kế 2D" },
  { slug: "phim-truong-3d", name: "Phim Trường 3D" },
  { slug: "3d-event", name: "3D Event" },
  { slug: "after-effects", name: "After Effects" },
  { slug: "noi-ngoai-that", name: "Nội Ngoại Thất" },
  { slug: "model-3d", name: "Model 3D" },
];

const AdminPricingManager = () => {
  const [pricing, setPricing] = useState<CategoryPricing[]>([]);
  const [notes, setNotes] = useState<Record<string, PricingNotes>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_SLUGS[0].slug);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPricing, setEditingPricing] = useState<CategoryPricing | null>(null);
  const [formData, setFormData] = useState({
    service_name: "",
    items: [{ label: "", price: "" }],
  });

  useEffect(() => {
    fetchPricing();
  }, [selectedCategory]);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      
      const { data: pricingData, error: pricingError } = await supabase
        .from("category_pricing")
        .select("*")
        .eq("category_slug", selectedCategory)
        .order("display_order", { ascending: true });

      if (pricingError) throw pricingError;
      
      const transformedPricing = (pricingData || []).map(item => ({
        ...item,
        items: Array.isArray(item.items) ? (item.items as unknown as PricingItem[]) : []
      }));
      
      setPricing(transformedPricing);

      const { data: notesData, error: notesError } = await supabase
        .from("category_pricing_notes")
        .select("*")
        .eq("category_slug", selectedCategory)
        .single();

      if (notesError && notesError.code !== "PGRST116") throw notesError;
      
      if (notesData) {
        setNotes(prev => ({
          ...prev,
          [selectedCategory]: {
            id: notesData.id,
            includes: notesData.includes || [],
            excludes: notesData.excludes || [],
            category_slug: selectedCategory,
          }
        }));
      }
    } catch (err) {
      console.error("Error fetching pricing:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { label: "", price: "" }],
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: "label" | "price", value: string) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.service_name || formData.items.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền tên dịch vụ và ít nhất 1 mục giá",
        variant: "destructive",
      });
      return;
    }

    // Filter out empty items
    const validItems = formData.items.filter(item => item.label && item.price);

    try {
      if (editingPricing) {
        const { error } = await supabase
          .from("category_pricing")
          .update({
            service_name: formData.service_name,
            items: validItems,
          })
          .eq("id", editingPricing.id);

        if (error) throw error;
        toast({ title: "Đã cập nhật bảng giá" });
      } else {
        const { error } = await supabase.from("category_pricing").insert({
          service_name: formData.service_name,
          items: validItems,
          category_slug: selectedCategory,
          display_order: pricing.length,
        });

        if (error) throw error;
        toast({ title: "Đã thêm bảng giá mới" });
      }

      setDialogOpen(false);
      setEditingPricing(null);
      setFormData({ service_name: "", items: [{ label: "", price: "" }] });
      fetchPricing();
    } catch (err) {
      console.error("Save error:", err);
      toast({
        title: "Lỗi",
        description: "Không thể lưu bảng giá",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (pricingItem: CategoryPricing) => {
    setEditingPricing(pricingItem);
    setFormData({
      service_name: pricingItem.service_name,
      items: pricingItem.items.length > 0 ? pricingItem.items : [{ label: "", price: "" }],
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa bảng giá này?")) return;

    try {
      const { error } = await supabase
        .from("category_pricing")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Đã xóa bảng giá" });
      fetchPricing();
    } catch (err) {
      console.error("Delete error:", err);
      toast({
        title: "Lỗi",
        description: "Không thể xóa bảng giá",
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setEditingPricing(null);
    setFormData({ service_name: "", items: [{ label: "", price: "" }] });
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
      {/* Category Selector */}
      <div className="glass-card p-4">
        <h2 className="font-semibold mb-3">Chọn danh mục</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_SLUGS.map((cat) => (
            <Button
              key={cat.slug}
              variant={selectedCategory === cat.slug ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.slug)}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">
          Bảng giá: <span className="text-primary">{selectedCategory}</span>
        </h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm bảng giá
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPricing ? "Chỉnh sửa bảng giá" : "Thêm bảng giá mới"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Tên nhóm dịch vụ *</Label>
                <Input
                  value={formData.service_name}
                  onChange={(e) =>
                    setFormData({ ...formData, service_name: e.target.value })
                  }
                  placeholder="VD: Logo Animation"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Các mục giá</Label>
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={item.label}
                        onChange={(e) => handleItemChange(index, "label", e.target.value)}
                        placeholder="Tên dịch vụ"
                        className="flex-1"
                      />
                      <Input
                        value={item.price}
                        onChange={(e) => handleItemChange(index, "price", e.target.value)}
                        placeholder="Giá (VD: 2.000.000đ)"
                        className="flex-1"
                      />
                      {formData.items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm mục
                </Button>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingPricing ? "Cập nhật" : "Thêm"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pricing List */}
      {pricing.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground">Chưa có bảng giá nào trong danh mục này</p>
          <Button className="mt-4" onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm bảng giá đầu tiên
          </Button>
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {pricing.map((p) => (
            <AccordionItem key={p.id} value={p.id} className="glass-card border-none">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-semibold text-primary">{p.service_name}</span>
                  <span className="text-sm text-muted-foreground">{p.items.length} mục</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-2 mb-4">
                  {p.items.map((item, index) => (
                    <div key={index} className="flex justify-between p-2 bg-card/50 rounded">
                      <span>{item.label}</span>
                      <span className="text-primary font-medium">{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(p)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Sửa
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default AdminPricingManager;
