import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCategoryPageImage = (categorySlug: string, sectionKey: string) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const { data, error } = await supabase
          .from("category_page_images")
          .select("image_url")
          .eq("category_slug", categorySlug)
          .eq("section_key", sectionKey)
          .maybeSingle();

        if (error) throw error;
        setImageUrl(data?.image_url || null);
      } catch (err) {
        console.error("Error fetching category page image:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [categorySlug, sectionKey]);

  return { imageUrl, loading };
};
