import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Edit2, Gift, GripVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ComboPackage {
  id: string;
  name: string;
  description: string;
  price: string;
  includes: string[];
  color: string;
  is_active: boolean;
  display_order: number;
}

const GRADIENT_PRESETS = [
  { label: "Cyan → Blue", value: "from-cyan-500 to-blue-500" },
  { label: "Purple → Pink", value: "from-purple-500 to-pink-500" },
  { label: "Green → Cyan", value: "from-green-500 to-cyan-500" },
  { label: "Orange → Red", value: "from-orange-500 to-red-500" },
  { label: "Blue → Violet", value: "from-blue-500 to-violet-500" },
];

const AdminComboManager = () => {
  const [combos, setCombos] = useState<ComboPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<ComboPackage | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    includes: [""],
    color: GRADIENT_PRESETS[0].value,
    is_active: true,
  });

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("combo_packages")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setCombos(data || []);
    } catch (err) {
      console.error("Error fetching combos:", err);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách combo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddInclude = () => {
    setFormData({
      ...formData,
      includes: [...formData.includes, ""],
    });
  };

  const handleRemoveInclude = (index: number) => {
    setFormData({
      ...formData,
      includes: formData.includes.filter((_, i) => i !== index),
    });
  };

  const handleIncludeChange = (index: number, value: string) => {
    const newIncludes = [...formData.includes];
    newIncludes[index] = value;
    setFormData({ ...formData, includes: newIncludes });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền tên và giá",
        variant: "destructive",
      });
      return;
    }

    const validIncludes = formData.includes.filter(item => item.trim());

    try {
      if (editingCombo) {
        const { error } = await supabase
          .from("combo_packages")
          .update({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            includes: validIncludes,
            color: formData.color,
            is_active: formData.is_active,
          })
          .eq("id", editingCombo.id);

        if (error) throw error;
        toast({ title: "Đã cập nhật combo" });
      } else {
        const { error } = await supabase.from("combo_packages").insert({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          includes: validIncludes,
          color: formData.color,
          is_active: formData.is_active,
          display_order: combos.length,
        });

        if (error) throw error;
        toast({ title: "Đã thêm combo mới" });
      }

      setDialogOpen(false);
      setEditingCombo(null);
      resetForm();
      fetchCombos();
    } catch (err) {
      console.error("Save error:", err);
      toast({
        title: "Lỗi",
        description: "Không thể lưu combo",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (combo: ComboPackage) => {
    setEditingCombo(combo);
    setFormData({
      name: combo.name,
      description: combo.description,
      price: combo.price,
      includes: combo.includes.length > 0 ? combo.includes : [""],
      color: combo.color,
      is_active: combo.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa combo này?")) return;

    try {
      const { error } = await supabase
        .from("combo_packages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Đã xóa combo" });
      fetchCombos();
    } catch (err) {
      console.error("Delete error:", err);
      toast({
        title: "Lỗi",
        description: "Không thể xóa combo",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      includes: [""],
      color: GRADIENT_PRESETS[0].value,
      is_active: true,
    });
  };

  const openAddDialog = () => {
    setEditingCombo(null);
    resetForm();
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
          Quản lý <span className="text-primary">Combo Packages</span>
        </h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm combo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCombo ? "Chỉnh sửa combo" : "Thêm combo mới"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tên combo *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="VD: COMBO EVENT FULL"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Giá *</Label>
                  <Input
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="VD: 35.000.000 – 50.000.000đ"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mô tả ngắn</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="VD: Gói bán chạy nhất"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Màu gradient</Label>
                <div className="flex flex-wrap gap-2">
                  {GRADIENT_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, color: preset.value })
                      }
                      className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                        formData.color === preset.value
                          ? "border-primary bg-primary/20"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 rounded mr-2 bg-gradient-to-r ${preset.value}`}
                      />
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bao gồm</Label>
                <div className="space-y-2">
                  {formData.includes.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => handleIncludeChange(index, e.target.value)}
                        placeholder="VD: Concept 2D"
                      />
                      {formData.includes.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveInclude(index)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleAddInclude}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm mục
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label>Hiển thị trên website</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingCombo ? "Cập nhật" : "Thêm"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Combo List */}
      {combos.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Chưa có combo nào</p>
          <Button className="mt-4" onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm combo đầu tiên
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {combos.map((combo) => (
            <div
              key={combo.id}
              className={`glass-card p-6 ${!combo.is_active ? "opacity-50" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="cursor-move text-muted-foreground">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${combo.color} flex items-center justify-center`}
                  >
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">{combo.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {combo.description}
                    </p>
                    <p className="text-lg font-bold gradient-text">{combo.price}</p>
                    {combo.includes.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {combo.includes.map((item, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(combo)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(combo.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminComboManager;
