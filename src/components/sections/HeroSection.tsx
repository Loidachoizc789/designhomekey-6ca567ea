import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import FloatingShapes from "@/components/FloatingShapes";
import ParticleField from "@/components/ParticleField";
import GalaxyBackground from "@/components/GalaxyBackground";
const stats = [{
  value: "500+",
  label: "ASSET 3D"
}, {
  value: "50+",
  label: "DỰ ÁN HOÀN THÀNH"
}, {
  value: "100%",
  label: "REALTIME RENDER"
}];
const HeroSection = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
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
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        ease: "easeOut"
      }} className="max-w-5xl mx-auto">
          {/* Logo DHK - Larger */}
          <motion.div initial={{
          opacity: 0,
          scale: 0.8,
          filter: "blur(20px)"
        }} animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(0px)"
        }} transition={{
          duration: 1,
          ease: "easeOut"
        }} className="mb-6">
            <img src="/lovable-uploads/1052d8d6-1118-4206-be15-c73ee5a0188e.png" alt="DesignHomeKey" className="h-24 sm:h-32 md:h-40 lg:h-48 xl:h-56 w-auto mx-auto border-0 object-fill" />
          </motion.div>

          {/* Subtitle - Larger text */}
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.5,
          duration: 0.8
        }} className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed">
            Hệ sinh thái asset dựng trên{" "}
            <span className="text-primary font-semibold">Unreal Engine & Blender</span>{" "}
            – phim trường 3D, thiết kế 2D và model 3D, tối ưu realtime cho livestream, TV show, sự kiện và quảng cáo.
          </motion.p>

          {/* CTA Buttons - Larger */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.7,
          duration: 0.8
        }} className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-7 text-lg font-medium rounded-full" asChild>
              <a href="#categories">
                Khám phá thư viện asset
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="border-border hover:bg-secondary px-10 py-7 text-lg font-medium rounded-full" asChild>
              <a href="#demo">
                <Play className="w-5 h-5 mr-2" />
                Xem demo realtime
              </a>
            </Button>
          </motion.div>

          {/* Stats - Larger */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.9,
          duration: 0.8
        }} className="flex flex-wrap justify-center gap-12 sm:gap-20">
            {stats.map((stat, index) => <motion.div key={stat.label} initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: 1 + index * 0.15,
            duration: 0.5
          }} className="text-center">
                <div className="font-display text-4xl sm:text-5xl md:text-6xl font-bold gradient-text mb-3">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>)}
          </motion.div>
        </motion.div>
      </div>
    </section>;
};
export default HeroSection;