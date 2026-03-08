import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Loader2, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { compressImage, formatBytes, isImageFile } from "@/lib/imageCompression";

interface ImageRecord {
  table: string;
  id: string;
  url: string;
  urlField: string;
}

const AdminBulkCompressor = () => {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState("");
  const [results, setResults] = useState<{
    compressed: number;
    skipped: number;
    failed: number;
    savedBytes: number;
  } | null>(null);

  const fetchAllImageRecords = async (): Promise<ImageRecord[]> => {
    const records: ImageRecord[] = [];

    // 1. category_images
    const { data: catImages } = await supabase.from("category_images").select("id, image_url");
    catImages?.forEach((r) => {
      if (r.image_url && !r.image_url.match(/\.(mp4|webm|mov)$/i)) {
        records.push({ table: "category_images", id: r.id, url: r.image_url, urlField: "image_url" });
      }
    });

    // 2. category_page_images
    const { data: pageImages } = await supabase.from("category_page_images").select("id, image_url");
    pageImages?.forEach((r) => {
      if (r.image_url) {
        records.push({ table: "category_page_images", id: r.id, url: r.image_url, urlField: "image_url" });
      }
    });

    // 3. product_media (images only)
    const { data: media } = await supabase.from("product_media").select("id, media_url, media_type");
    media?.forEach((r) => {
      if (r.media_type === "image" && r.media_url) {
        records.push({ table: "product_media", id: r.id, url: r.media_url, urlField: "media_url" });
      }
    });

    // 4. categories (home images)
    const { data: cats } = await supabase.from("categories").select("id, home_image_url");
    cats?.forEach((r) => {
      if (r.home_image_url) {
        records.push({ table: "categories", id: r.id, url: r.home_image_url, urlField: "home_image_url" });
      }
    });

    // 5. homepage_banners
    const { data: banners } = await supabase.from("homepage_banners").select("id, image_url");
    banners?.forEach((r) => {
      if (r.image_url) {
        records.push({ table: "homepage_banners", id: r.id, url: r.image_url, urlField: "image_url" });
      }
    });

    return records;
  };

  const compressAndReplace = async (record: ImageRecord): Promise<{ saved: number; compressed: boolean }> => {
    // Skip if already webp
    if (record.url.match(/\.webp$/i)) {
      return { saved: 0, compressed: false };
    }

    try {
      // Download image
      const response = await fetch(record.url);
      if (!response.ok) throw new Error("Failed to fetch");

      const blob = await response.blob();
      const fileName = record.url.split("/").pop() || "image.jpg";
      const file = new File([blob], fileName, { type: blob.type });

      // Skip non-images
      if (!isImageFile(file)) {
        return { saved: 0, compressed: false };
      }

      // Compress
      const result = await compressImage(file, { quality: 0.8, maxWidth: 1920, maxHeight: 1920 });
      if (!result.wasCompressed) {
        return { saved: 0, compressed: false };
      }

      // Upload compressed version
      const oldPath = extractStoragePath(record.url);
      const bucket = extractBucket(record.url);
      if (!oldPath || !bucket) return { saved: 0, compressed: false };

      const newPath = oldPath.replace(/\.[^.]+$/, ".webp");

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(newPath, result.file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(newPath);

      // Update DB record
      const { error: updateError } = await supabase
        .from(record.table as any)
        .update({ [record.urlField]: urlData.publicUrl } as any)
        .eq("id", record.id);

      if (updateError) throw updateError;

      // Try to delete old file (non-critical)
      if (oldPath !== newPath) {
        await supabase.storage.from(bucket).remove([oldPath]).catch(() => {});
      }

      return { saved: result.originalSize - result.compressedSize, compressed: true };
    } catch (err) {
      console.error("Compress error for", record.url, err);
      return { saved: 0, compressed: false };
    }
  };

  const extractBucket = (url: string): string | null => {
    if (url.includes("/category-images/")) return "category-images";
    if (url.includes("/homepage-assets/")) return "homepage-assets";
    return null;
  };

  const extractStoragePath = (url: string): string | null => {
    // URL format: .../storage/v1/object/public/bucket-name/path/to/file.ext
    const match = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
    return match ? match[1] : null;
  };

  const handleBulkCompress = async () => {
    if (!confirm("Bạn có chắc muốn nén tất cả ảnh hiện tại? Quá trình này có thể mất vài phút.")) return;

    setRunning(true);
    setResults(null);
    setProgress(0);

    try {
      const records = await fetchAllImageRecords();
      setTotal(records.length);

      let compressed = 0;
      let skipped = 0;
      let failed = 0;
      let savedBytes = 0;

      for (let i = 0; i < records.length; i++) {
        setCurrent(records[i].url.split("/").pop() || "...");
        setProgress(Math.round(((i + 1) / records.length) * 100));

        try {
          const result = await compressAndReplace(records[i]);
          if (result.compressed) {
            compressed++;
            savedBytes += result.saved;
          } else {
            skipped++;
          }
        } catch {
          failed++;
        }
      }

      setResults({ compressed, skipped, failed, savedBytes });
      toast({
        title: "Hoàn tất nén ảnh!",
        description: `Đã nén ${compressed} ảnh, tiết kiệm ${formatBytes(savedBytes)}`,
      });
    } catch (err) {
      console.error("Bulk compress error:", err);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi nén ảnh",
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-display font-semibold">Nén ảnh hàng loạt</h3>
            <p className="text-sm text-muted-foreground">
              Tự động nén tất cả ảnh hiện có sang WebP để tiết kiệm dung lượng
            </p>
          </div>
        </div>
        <Button onClick={handleBulkCompress} disabled={running}>
          {running ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang nén...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Nén tất cả
            </>
          )}
        </Button>
      </div>

      {running && (
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-muted-foreground">
            Đang xử lý: {current} ({progress}%)
          </p>
        </div>
      )}

      {results && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-lg font-bold">{results.compressed}</p>
            <p className="text-xs text-muted-foreground">Đã nén</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <AlertCircle className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
            <p className="text-lg font-bold">{results.skipped}</p>
            <p className="text-xs text-muted-foreground">Bỏ qua</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <AlertCircle className="w-5 h-5 text-destructive mx-auto mb-1" />
            <p className="text-lg font-bold">{results.failed}</p>
            <p className="text-xs text-muted-foreground">Lỗi</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold">{formatBytes(results.savedBytes)}</p>
            <p className="text-xs text-muted-foreground">Đã tiết kiệm</p>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground border-t border-border pt-3">
        ⚠️ Video (.mp4, .webm, .mov) không thể nén trên trình duyệt. Hãy nén video bằng{" "}
        <a href="https://handbrake.fr" target="_blank" rel="noopener noreferrer" className="text-primary underline">
          HandBrake
        </a>{" "}
        hoặc{" "}
        <a href="https://www.veed.io/tools/video-compressor" target="_blank" rel="noopener noreferrer" className="text-primary underline">
          VEED.io
        </a>{" "}
        trước khi upload.
      </p>
    </div>
  );
};

export default AdminBulkCompressor;
