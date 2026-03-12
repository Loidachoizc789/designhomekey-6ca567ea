import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Upload, X, Video, Image as ImageIcon, GripVertical, SplitSquareHorizontal, ChevronUp, ChevronDown, CheckSquare, Square } from "lucide-react";
import { compressImage, formatBytes } from "@/lib/imageCompression";
import { isYouTubeUrl, getYouTubeThumbnail } from "@/lib/youtube";
import ImageComparisonSlider from "@/components/ImageComparisonSlider";

interface ProductMedia {
  id: string;
  product_id: string;
  media_url: string;
  media_type: string;
  display_order: number;
}

interface ProductMediaManagerProps {
  productId: string;
}

const ProductMediaManager = ({ productId }: ProductMediaManagerProps) => {
  const [media, setMedia] = useState<ProductMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [comparisonBefore, setComparisonBefore] = useState<File | null>(null);
  const [comparisonAfter, setComparisonAfter] = useState<File | null>(null);
  const [comparisonUploading, setComparisonUploading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);

  useEffect(() => {
    fetchMedia();
    
    const channel = supabase
      .channel(`product-media-${productId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "product_media",
          filter: `product_id=eq.${productId}`,
        },
        () => fetchMedia()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productId]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("product_media")
        .select("*")
        .eq("product_id", productId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setMedia(data || []);
    } catch (err) {
      console.error("Error fetching media:", err);
      toast({ title: "Lỗi", description: "Không thể tải media", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 500 * 1024 * 1024) {
          toast({ title: "Lỗi", description: `${file.name} quá lớn. Tối đa 500MB.`, variant: "destructive" });
          continue;
        }

        const fileExt = file.name.split(".").pop()?.toLowerCase();
        const isVideo = ["mp4", "webm", "mov"].includes(fileExt || "");
        const compressed = await compressImage(file);
        const uploadFile = compressed.file;
        const finalExt = uploadFile.name.split(".").pop()?.toLowerCase();
        const fileName = `products/${productId}/${Date.now()}_${i}.${finalExt}`;

        if (compressed.wasCompressed) {
          toast({ title: "Đã nén ảnh", description: `${file.name}: ${formatBytes(compressed.originalSize)} → ${formatBytes(compressed.compressedSize)}` });
        }

        const { error: uploadError } = await supabase.storage.from("category-images").upload(fileName, uploadFile);
        if (uploadError) { console.error("Upload error:", uploadError); continue; }

        const { data: urlData } = supabase.storage.from("category-images").getPublicUrl(fileName);
        const { error: insertError } = await supabase.from("product_media").insert({
          product_id: productId,
          media_url: urlData.publicUrl,
          media_type: isVideo ? "video" : "image",
          display_order: media.length + i,
        });
        if (insertError) console.error("Insert error:", insertError);
      }

      toast({ title: "Thành công", description: `Đã upload ${files.length} file` });
      fetchMedia();
    } catch (err) {
      console.error("Upload error:", err);
      toast({ title: "Lỗi upload", description: "Không thể upload file", variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleUrlAdd = async (url: string) => {
    if (!url) return;
    const isYT = isYouTubeUrl(url);
    const isVideo = url.match(/\.(mp4|webm|mov)$/i);
    const mediaType = isYT ? "youtube" : isVideo ? "video" : "image";

    try {
      const { error } = await supabase.from("product_media").insert({
        product_id: productId, media_url: url, media_type: mediaType, display_order: media.length,
      });
      if (error) throw error;
      toast({ title: "Đã thêm media" });
      fetchMedia();
    } catch (err) {
      console.error("Add URL error:", err);
      toast({ title: "Lỗi", description: "Không thể thêm media", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa media này?")) return;
    try {
      const { error } = await supabase.from("product_media").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Đã xóa media" });
      fetchMedia();
    } catch (err) {
      console.error("Delete error:", err);
      toast({ title: "Lỗi", description: "Không thể xóa media", variant: "destructive" });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Xóa ${selectedIds.size} media đã chọn?`)) return;
    try {
      const { error } = await supabase.from("product_media").delete().in("id", Array.from(selectedIds));
      if (error) throw error;
      toast({ title: `Đã xóa ${selectedIds.size} media` });
      setSelectedIds(new Set());
      setSelectMode(false);
      fetchMedia();
    } catch (err) {
      console.error("Bulk delete error:", err);
      toast({ title: "Lỗi", description: "Không thể xóa media", variant: "destructive" });
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === media.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(media.map(m => m.id)));
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= media.length) return;

    const current = media[index];
    const target = media[targetIndex];

    try {
      await Promise.all([
        supabase.from("product_media").update({ display_order: target.display_order }).eq("id", current.id),
        supabase.from("product_media").update({ display_order: current.display_order }).eq("id", target.id),
      ]);
      fetchMedia();
    } catch (err) {
      console.error("Move error:", err);
      toast({ title: "Lỗi", description: "Không thể di chuyển", variant: "destructive" });
    }
  };

  const [urlInput, setUrlInput] = useState("");

  if (loading) {
    return (
      <div className="py-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="glass-card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Thêm Media (Không giới hạn số lượng)
        </h3>
        
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center mb-4">
          <Input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" id="multi-file-upload" multiple disabled={uploading} />
          <label htmlFor="multi-file-upload" className="cursor-pointer flex flex-col items-center gap-2">
            {uploading ? <Loader2 className="w-8 h-8 animate-spin text-primary" /> : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click để upload nhiều ảnh/video (max 500MB mỗi file)</span>
              </>
            )}
          </label>
        </div>

        <div className="flex gap-2">
          <Input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="Dán URL ảnh/video hoặc link YouTube..." className="flex-1" />
          <Button onClick={() => { handleUrlAdd(urlInput); setUrlInput(""); }} disabled={!urlInput}>
            <Plus className="w-4 h-4 mr-2" /> Thêm URL
          </Button>
        </div>

        {/* Comparison Upload */}
        <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <SplitSquareHorizontal className="w-4 h-4 text-primary" />
            Image Comparison Slider (Before/After)
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Ảnh Before</label>
              <Input type="file" accept="image/*" onChange={(e) => setComparisonBefore(e.target.files?.[0] || null)} className="text-xs" />
              {comparisonBefore && <p className="text-xs text-muted-foreground mt-1 truncate">{comparisonBefore.name}</p>}
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Ảnh After</label>
              <Input type="file" accept="image/*" onChange={(e) => setComparisonAfter(e.target.files?.[0] || null)} className="text-xs" />
              {comparisonAfter && <p className="text-xs text-muted-foreground mt-1 truncate">{comparisonAfter.name}</p>}
            </div>
          </div>
          <Button
            className="mt-3 w-full"
            disabled={!comparisonBefore || !comparisonAfter || comparisonUploading}
            onClick={async () => {
              if (!comparisonBefore || !comparisonAfter) return;
              setComparisonUploading(true);
              try {
                const urls: string[] = [];
                for (const file of [comparisonBefore, comparisonAfter]) {
                  const compressed = await compressImage(file);
                  const ext = compressed.file.name.split(".").pop()?.toLowerCase();
                  const fileName = `products/${productId}/${Date.now()}_comp_${urls.length}.${ext}`;
                  const { error: upErr } = await supabase.storage.from("category-images").upload(fileName, compressed.file);
                  if (upErr) throw upErr;
                  const { data: urlData } = supabase.storage.from("category-images").getPublicUrl(fileName);
                  urls.push(urlData.publicUrl);
                }
                const comparisonData = JSON.stringify({ before: urls[0], after: urls[1] });
                const { error: insertErr } = await supabase.from("product_media").insert({
                  product_id: productId, media_url: comparisonData, media_type: "comparison", display_order: media.length,
                });
                if (insertErr) throw insertErr;
                toast({ title: "Đã thêm Comparison Slider" });
                setComparisonBefore(null); setComparisonAfter(null);
                fetchMedia();
              } catch (err) {
                console.error("Comparison upload error:", err);
                toast({ title: "Lỗi", description: "Không thể tạo comparison", variant: "destructive" });
              } finally { setComparisonUploading(false); }
            }}
          >
            {comparisonUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <SplitSquareHorizontal className="w-4 h-4 mr-2" />}
            Tạo Comparison Slider
          </Button>
        </div>
      </div>

      {/* Media Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Thư viện media ({media.length} items)</h3>
          {media.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={selectMode ? "default" : "outline"}
                onClick={() => {
                  setSelectMode(!selectMode);
                  if (selectMode) setSelectedIds(new Set());
                }}
              >
                <CheckSquare className="w-4 h-4 mr-1" />
                {selectMode ? "Hủy chọn" : "Chọn nhiều"}
              </Button>
              {selectMode && (
                <>
                  <Button size="sm" variant="outline" onClick={toggleSelectAll}>
                    {selectedIds.size === media.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={handleBulkDelete} disabled={selectedIds.size === 0}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Xóa ({selectedIds.size})
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
        
        {media.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Chưa có media nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {media.map((item, index) => (
              <div
                key={item.id}
                className={`relative group aspect-square rounded-lg overflow-hidden border bg-card transition-all ${
                  selectMode && selectedIds.has(item.id) ? "border-primary ring-2 ring-primary/50" : "border-border"
                }`}
                onClick={selectMode ? () => toggleSelect(item.id) : undefined}
              >
                {item.media_type === "comparison" ? (() => {
                  try {
                    const data = JSON.parse(item.media_url);
                    return <ImageComparisonSlider beforeImage={data.before} afterImage={data.after} className="w-full h-full" />;
                  } catch { return <div className="w-full h-full bg-muted flex items-center justify-center text-xs">Invalid</div>; }
                })() : item.media_type === "youtube" ? (
                  <img src={getYouTubeThumbnail(item.media_url) || ""} alt={`YouTube ${index + 1}`} className="w-full h-full object-cover" />
                ) : item.media_type === "video" ? (
                  <video src={item.media_url} className="w-full h-full object-cover" muted
                    onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }} />
                ) : (
                  <img src={item.media_url} alt={`Media ${index + 1}`} className="w-full h-full object-cover" />
                )}
                
                {/* Select checkbox */}
                {selectMode && (
                  <div className="absolute top-1 left-1 z-10">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${selectedIds.has(item.id) ? "bg-primary text-primary-foreground" : "bg-background/80 text-foreground"}`}>
                      {selectedIds.has(item.id) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    </div>
                  </div>
                )}

                {/* Type indicator */}
                {!selectMode && (
                  <div className="absolute top-1 left-1">
                    {item.media_type === "comparison" ? (
                      <div className="w-6 h-6 rounded bg-accent/80 flex items-center justify-center"><SplitSquareHorizontal className="w-3 h-3 text-accent-foreground" /></div>
                    ) : item.media_type === "youtube" || item.media_type === "video" ? (
                      <div className="w-6 h-6 rounded bg-destructive/80 flex items-center justify-center"><Video className="w-3 h-3 text-destructive-foreground" /></div>
                    ) : (
                      <div className="w-6 h-6 rounded bg-primary/80 flex items-center justify-center"><ImageIcon className="w-3 h-3 text-primary-foreground" /></div>
                    )}
                  </div>
                )}

                {/* Order number */}
                <div className="absolute top-1 right-1 w-6 h-6 rounded bg-background/80 flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>

                {/* Hover actions (non-select mode) */}
                {!selectMode && (
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="secondary" onClick={() => handleMove(index, "up")} disabled={index === 0} title="Di chuyển lên">
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleMove(index, "down")} disabled={index === media.length - 1} title="Di chuyển xuống">
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductMediaManager;
