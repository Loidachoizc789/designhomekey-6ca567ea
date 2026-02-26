import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSiteSetting = (key: string) => {
  const [value, setValue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("id", key)
        .maybeSingle();
      setValue(data?.value ?? null);
      setLoading(false);
    };
    fetch();

    const channel = supabase
      .channel(`site-setting-${key}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings", filter: `id=eq.${key}` }, (payload: any) => {
        setValue(payload.new?.value ?? null);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [key]);

  return { value, loading };
};

export const updateSiteSetting = async (key: string, value: any) => {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: key, value, updated_at: new Date().toISOString() });
  return { error };
};
