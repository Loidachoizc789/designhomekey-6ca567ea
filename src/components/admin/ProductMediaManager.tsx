import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Upload, X, Video, Image as ImageIcon, GripVertical } from "lucide-react";

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

  useEffect(() => {
    fetchMedia();
    
    // Realtime subscription
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
      toast({
        title: "Lỗi",
        description: "Không thể tải media",
        variant: "destructive",
      });
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
        
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "Lỗi",
            description: `${file.name} quá lớn. Tối đa 10MB.`,
            variant: "destructive",
          });
          continue;
        }

        const fileExt = file.name.split(".").pop()?.toLowerCase();
        const fileName = `products/${productId}/${Date.now()}_${i}.${fileExt}`;
        const isVideo = ["mp4", "webm", "mov"].includes(fileExt || "");

        const { error: uploadError } = await supabase.storage
          .from("category-images")
          .upload(fileName, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from("category-images")
          .getPublicUrl(fileName);

        // Insert into product_media
        const { error: insertError } = await supabase
          .from("product_media")
          .insert({
            product_id: productId,
            media_url: urlData.publicUrl,
            media_type: isVideo ? "video" : "image",
            display_order: media.length + i,
          });

        if (insertError) {
          console.error("Insert error:", insertError);
        }
      }

      toast({
        title: "Thành công",
        description: `Đã upload ${files.length} file`,
      });
      fetchMedia();
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        title: "Lỗi upload",
        description: "Không thể upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleUrlAdd = async (url: string) => {
    if (!url) return;

    const isVideo = url.match(/\.(mp4|webm|mov)$/i);

    try {
      const { error } = await supabase
        .from("product_media")
        .insert({
          product_id: productId,
          media_url: url,
          media_type: isVideo ? "video" : "image",
          display_order: media.length,
        });

      if (error) throw error;
      toast({ title: "Đã thêm media" });
      fetchMedia();
    } catch (err) {
      console.error("Add URL error:", err);
      toast({
        title: "Lỗi",
        description: "Không thể thêm media",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa media này?")) return;

    try {
      const { error } = await supabase
        .from("product_media")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Đã xóa media" });
      fetchMedia();
    } catch (err) {
      console.error("Delete error:", err);
      toast({
        title: "Lỗi",
        description: "Không thể xóa media",
        variant: "destructive",
      });
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
        
        {/* File Upload */}
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center mb-4">
          <Input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
            id="multi-file-upload"
            multiple
            disabled={uploading}
          />
          <label
            htmlFor="multi-file-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click để upload nhiều ảnh/video (max 10MB mỗi file)
                </span>
              </>
            )}
          </label>
        </div>

        {/* URL Input */}
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Hoặc dán URL ảnh/video..."
            className="flex-1"
          />
          <Button 
            onClick={() => {
              handleUrlAdd(urlInput);
              setUrlInput("");
            }}
            disabled={!urlInput}
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm URL
          </Button>
        </div>
      </div>

      {/* Media Grid */}
      <div>
        <h3 className="font-semibold mb-4">
          Thư viện media ({media.length} items)
        </h3>
        
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
                className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-card"
              >
                {item.media_type === "video" ? (
                  <video
                    src={item.media_url}
                    className="w-full h-full object-cover"
                    muted
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                ) : (
                  <img
                    src={item.media_url}
                    alt={`Media ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Type indicator */}
                <div className="absolute top-1 left-1">
                  {item.media_type === "video" ? (
                    <div className="w-6 h-6 rounded bg-red-500/80 flex items-center justify-center">
                      <Video className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded bg-blue-500/80 flex items-center justify-center">
                      <ImageIcon className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Order number */}
                <div className="absolute top-1 right-1 w-6 h-6 rounded bg-background/80 flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>

                {/* Delete button */}
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductMediaManager;
