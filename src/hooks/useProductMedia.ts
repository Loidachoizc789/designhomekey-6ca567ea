import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProductMedia {
  id: string;
  product_id: string;
  media_url: string;
  media_type: string;
  display_order: number;
}

export const useProductMedia = (productId: string | null) => {
  const [media, setMedia] = useState<ProductMedia[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) {
      setMedia([]);
      return;
    }

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
        console.error("Error fetching product media:", err);
        setMedia([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [productId]);

  return { media, loading };
};
