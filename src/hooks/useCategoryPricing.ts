import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PricingItem {
  label: string;
  price: string;
}

interface CategoryPricing {
  id: string;
  service_name: string;
  items: PricingItem[];
  display_order: number;
  category_slug: string;
}

interface PricingNotes {
  includes: string[];
  excludes: string[];
}

export const useCategoryPricing = (categorySlug: string) => {
  const [pricing, setPricing] = useState<CategoryPricing[]>([]);
  const [notes, setNotes] = useState<PricingNotes>({ includes: [], excludes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        setLoading(true);
        
        // Fetch pricing data
        const { data: pricingData, error: pricingError } = await supabase
          .from("category_pricing")
          .select("*")
          .eq("category_slug", categorySlug)
          .order("display_order", { ascending: true });

        if (pricingError) throw pricingError;
        
        // Transform the data to ensure items is properly typed
        const transformedPricing = (pricingData || []).map(item => ({
          ...item,
          items: Array.isArray(item.items) 
            ? (item.items as unknown as PricingItem[])
            : []
        }));
        
        setPricing(transformedPricing);

        // Fetch pricing notes
        const { data: notesData, error: notesError } = await supabase
          .from("category_pricing_notes")
          .select("*")
          .eq("category_slug", categorySlug)
          .single();

        if (notesError && notesError.code !== "PGRST116") throw notesError;
        
        if (notesData) {
          setNotes({
            includes: notesData.includes || [],
            excludes: notesData.excludes || [],
          });
        }
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching category pricing:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();

    // Set up realtime subscription for pricing
    const pricingChannel = supabase
      .channel(`category-pricing-${categorySlug}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "category_pricing",
          filter: `category_slug=eq.${categorySlug}`,
        },
        () => {
          fetchPricing();
        }
      )
      .subscribe();

    // Set up realtime subscription for notes
    const notesChannel = supabase
      .channel(`category-pricing-notes-${categorySlug}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "category_pricing_notes",
          filter: `category_slug=eq.${categorySlug}`,
        },
        () => {
          fetchPricing();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(pricingChannel);
      supabase.removeChannel(notesChannel);
    };
  }, [categorySlug]);

  return { pricing, notes, loading, error };
};
