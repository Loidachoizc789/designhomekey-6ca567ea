import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Palette, Box, Video, Handshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const collaborators = [
  {
    icon: Palette,
    title: "Designer 2D",
    description: "Key visual, backdrop, layout, POSM",
  },
  {
    icon: Box,
    title: "3D Artist",
    description: "Props, modular set, asset UE5/Blender",
  },
  {
    icon: Video,
    title: "Team sản xuất nội dung",
    description: "Livestream, TV show, event, quảng cáo",
  },
];

const benefits = [
  "Asset dùng chung",
  "Dự án lớn từ nhiều thiết kế nhỏ",
  "Chia sẻ cơ hội & giá trị lâu dài",
];

const CollaborationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="collaboration" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-glow-secondary/5" />
      <div className="absolute inset-0 grid-pattern opacity-10" />
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-glow-secondary/10 rounded-full blur-3xl" />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
              <Handshake className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Cùng phát triển</span>
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Luôn sẵn sàng{" "}
              <span className="gradient-text">hợp tác</span>
              <br />
              cùng designer
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              Chúng tôi mở rộng hệ sinh thái bằng cách hợp tác với designer 2D, 3D artist 
              và team sản xuất nội dung để cùng xây dựng asset dùng chung và tạo ra các dự án lớn từ nhiều thiết kế nhỏ.
            </p>

            {/* What we build together */}
            <div className="mb-8">
              <h4 className="font-semibold text-foreground mb-4">Cùng xây dựng:</h4>
              <div className="flex flex-wrap gap-3">
                {benefits.map((benefit) => (
                  <span
                    key={benefit}
                    className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            <Button variant="hero" size="xl" asChild>
              <a href="#contact">
                Liên hệ hợp tác
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </motion.div>

          {/* Right Content - Collaborator Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {collaborators.map((collaborator, index) => (
              <motion.div
                key={collaborator.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="glass-card p-6 card-hover flex items-center gap-6 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <collaborator.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                    {collaborator.title}
                  </h3>
                  <p className="text-muted-foreground">{collaborator.description}</p>
                </div>
              </motion.div>
            ))}

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="glass-card p-6 glow-primary"
            >
              <div className="flex items-center justify-center gap-4 text-center">
                <Users className="w-10 h-10 text-primary" />
                <div>
                  <p className="font-display text-2xl font-bold text-foreground">
                    Mở rộng cộng đồng
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Designer, artist, creator ở mọi nơi
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CollaborationSection;
