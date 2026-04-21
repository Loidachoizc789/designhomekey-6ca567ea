import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Subcategory {
  id: string;
  category_slug: string;
  slug: string;
  name: string;
  display_order: number;
}

export const useSubcategories = (categorySlug: string | null) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubcategories = useCallback(async () => {
    if (!categorySlug) {
      setSubcategories([]);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_slug", categorySlug)
        .order("display_order", { ascending: true });
      if (error) throw error;
      setSubcategories(data || []);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  }, [categorySlug]);

  useEffect(() => {
    fetchSubcategories();

    if (!categorySlug) return;

    const channel = supabase
      .channel(`subcategories-${categorySlug}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subcategories",
          filter: `category_slug=eq.${categorySlug}`,
        },
        () => fetchSubcategories()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSubcategories, categorySlug]);

  return { subcategories, loading, refetch: fetchSubcategories };
};
