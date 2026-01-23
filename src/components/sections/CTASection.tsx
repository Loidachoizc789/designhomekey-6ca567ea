import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="cta" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-glow-secondary/10" />
      <div className="absolute inset-0 grid-pattern opacity-10" />
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-glow-secondary/20 rounded-full blur-3xl" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="glass-card p-12 md:p-16 text-center max-w-4xl mx-auto glow-primary"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Bắt đầu với{" "}
            <span className="gradient-text">Phim Trường 3D</span>
            <br />
            Ngay Hôm Nay
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Khám phá bộ sưu tập phim trường 3D chất lượng cao hoặc liên hệ với chúng tôi 
            để được tư vấn giải pháp phù hợp nhất cho dự án của bạn.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <a href="#featured">
                Xem toàn bộ phim trường 3D
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <a href="#contact">
                <MessageCircle className="w-5 h-5" />
                Liên hệ tư vấn & báo giá
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-4">Được tin dùng bởi</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              <span className="font-display font-bold text-xl">Studio A</span>
              <span className="font-display font-bold text-xl">Agency B</span>
              <span className="font-display font-bold text-xl">Brand C</span>
              <span className="font-display font-bold text-xl">Media D</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
