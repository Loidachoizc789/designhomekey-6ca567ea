import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import FloatingShapes from "@/components/FloatingShapes";
import ParticleField from "@/components/ParticleField";
import GalaxyBackground from "@/components/GalaxyBackground";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HomepageStat {
  id: string;
  stat_key: string;
  stat_value: string;
  stat_label: string;
  display_order: number;
}

const defaultStats = [
  { value: "500+", label: "ASSET 3D" },
  { value: "50+", label: "DỰ ÁN HOÀN THÀNH" },
  { value: "100%", label: "REALTIME RENDER" },
];

const HeroSection = () => {
  const [stats, setStats] = useState<{ value: string; label: string }[]>(defaultStats);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from("homepage_stats")
        .select("*")
        .order("display_order");

      if (!error && data && data.length > 0) {
        setStats(data.map((s: HomepageStat) => ({ value: s.stat_value, label: s.stat_label })));
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Galaxy Background Effect */}
      <GalaxyBackground />
      
      {/* Floating Glass Shapes - distributed on sides */}
      <FloatingShapes />
      
      {/* Particle Field */}
      <ParticleField />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-10" />

      {/* Content */}
      <div className="relative z-10 section-container text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          {/* Logo DHK - Much Larger */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-4"
          >
            <img
              src="/lovable-uploads/1052d8d6-1118-4206-be15-c73ee5a0188e.png"
              alt="DesignHomeKey"
              className="h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 w-auto mx-auto border-0 object-contain"
            />
          </motion.div>

          {/* Subtitle - Smaller text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Hệ sinh thái asset dựng trên{" "}
            <span className="text-primary font-semibold">Unreal Engine & Blender</span>{" "}
            – phim trường 3D, thiết kế 2D và model 3D, tối ưu realtime cho livestream, TV show, sự kiện và quảng cáo.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-medium rounded-full"
              asChild
            >
              <a href="#categories">
                Khám phá thư viện asset
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border hover:bg-secondary px-8 py-6 text-base font-medium rounded-full"
              asChild
            >
              <a href="#demo">
                <Play className="w-5 h-5 mr-2" />
                Xem demo realtime
              </a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-10 sm:gap-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.15, duration: 0.5 }}
                className="text-center"
              >
                <div className="font-display text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;