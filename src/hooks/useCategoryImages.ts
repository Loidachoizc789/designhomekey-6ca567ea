import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CategoryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  display_order: number;
  category_slug: string;
}

export const useCategoryImages = (categorySlug: string, subcategorySlug?: string) => {
  const [images, setImages] = useState<CategoryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from("category_images")
          .select("*")
          .eq("category_slug", categorySlug)
          .order("display_order", { ascending: true });

        if (subcategorySlug) {
          query = query.eq("subcategory_slug", subcategorySlug);
        }

        const { data, error } = await query;

        if (error) throw error;
        setImages(data || []);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching category images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();

    const channelName = subcategorySlug
      ? `category-images-${categorySlug}-${subcategorySlug}`
      : `category-images-${categorySlug}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "category_images",
          filter: `category_slug=eq.${categorySlug}`,
        },
        () => {
          fetchImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [categorySlug, subcategorySlug]);

  // Transform to include productId for fetching media
  const imagesWithProductId = images.map(img => ({
    ...img,
    productId: img.id, // The UUID is the product_id for product_media table
  }));

  return { images: imagesWithProductId, loading, error };
};
