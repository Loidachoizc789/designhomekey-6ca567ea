import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HardDrive, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface BucketStat {
  bucket: string;
  file_count: number;
  total_bytes: number;
}

interface StorageStats {
  buckets: BucketStat[];
  total_bytes: number;
  total_files: number;
  max_bytes: number;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const bucketLabels: Record<string, string> = {
  "category-images": "Ảnh & Video sản phẩm",
  "homepage-assets": "Trang chủ",
};

const AdminStorageStats = () => {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase.functions.invoke("storage-stats", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;
      setStats(data);
    } catch (err) {
      console.error("Error fetching storage stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const usagePercent = stats ? (stats.total_bytes / stats.max_bytes) * 100 : 0;

  return (
    <div className="glass-card p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-primary" />
          Dung lượng Storage
        </h3>
        <Button variant="ghost" size="sm" onClick={fetchStats} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {loading && !stats ? (
        <div className="h-20 flex items-center justify-center text-muted-foreground text-sm">
          Đang tải...
        </div>
      ) : stats ? (
        <div className="space-y-4">
          {/* Overall usage */}
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">
                {stats.total_files} files • {formatBytes(stats.total_bytes)}
              </span>
              <span className="font-medium">
                {formatBytes(stats.max_bytes)}
              </span>
            </div>
            <Progress value={usagePercent} className="h-2.5" />
            <p className="text-xs text-muted-foreground mt-1">
              Đã sử dụng {usagePercent.toFixed(1)}%
            </p>
          </div>

          {/* Per-bucket breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stats.buckets.map((bucket) => (
              <div
                key={bucket.bucket}
                className="rounded-lg border border-border bg-card/50 p-3"
              >
                <p className="text-sm font-medium truncate">
                  {bucketLabels[bucket.bucket] || bucket.bucket}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {bucket.file_count} files • {formatBytes(bucket.total_bytes)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Không thể tải thông tin storage</p>
      )}
    </div>
  );
};

export default AdminStorageStats;
