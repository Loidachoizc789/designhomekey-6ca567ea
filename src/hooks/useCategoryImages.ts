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

export const useCategoryImages = (categorySlug: string) => {
  const [images, setImages] = useState<CategoryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("category_images")
          .select("*")
          .eq("category_slug", categorySlug)
          .order("display_order", { ascending: true });

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

    // Set up realtime subscription
    const channel = supabase
      .channel(`category-images-${categorySlug}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "category_images",
          filter: `category_slug=eq.${categorySlug}`,
        },
        () => {
          // Refetch when changes occur
          fetchImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [categorySlug]);

  // Transform to include productId for fetching media
  const imagesWithProductId = images.map(img => ({
    ...img,
    productId: img.id, // The UUID is the product_id for product_media table
  }));

  return { images: imagesWithProductId, loading, error };
};
