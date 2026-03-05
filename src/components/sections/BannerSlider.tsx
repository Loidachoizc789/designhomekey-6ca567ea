import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: string;
  image_url: string;
  title: string;
  link_url: string;
  display_order: number;
}

const BannerSlider = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data } = await supabase
        .from("homepage_banners")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (data && data.length > 0) setBanners(data);
      setLoading(false);
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goTo = useCallback((idx: number) => setCurrent(idx), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + banners.length) % banners.length), [banners.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % banners.length), [banners.length]);

  if (loading || banners.length === 0) return null;

  const banner = banners[current];

  return (
    <section className="w-full px-4 sm:px-8 lg:px-16 pt-24 md:pt-28 pb-0">
      <div className="relative w-full max-w-7xl mx-auto rounded-2xl overflow-hidden bg-card/30" style={{ aspectRatio: '820/312' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {banner.link_url ? (
              <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                <img src={banner.image_url} alt={banner.title || "Banner"} className="w-full h-full object-cover" loading="eager" />
              </a>
            ) : (
              <img src={banner.image_url} alt={banner.title || "Banner"} className="w-full h-full object-cover" loading="eager" />
            )}
          </motion.div>
        </AnimatePresence>

        {banners.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-background/60 backdrop-blur-sm hover:bg-background/80 rounded-full p-2 transition-colors" aria-label="Previous">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-background/60 backdrop-blur-sm hover:bg-background/80 rounded-full p-2 transition-colors" aria-label="Next">
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </>
        )}

        {banners.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2.5 rounded-full transition-all ${i === current ? "bg-primary w-6" : "bg-foreground/40 hover:bg-foreground/60 w-2.5"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BannerSlider;
