import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Video, Palette, Box, Zap, Sun, Move, Layers, Monitor, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import setTalkshow from "@/assets/set-talkshow.jpg";
import setLivestream from "@/assets/set-livestream.jpg";
import setEvent from "@/assets/set-event.jpg";
import setNews from "@/assets/set-news.jpg";

const categories = [
  {
    id: "3d-studios",
    title: "Phim Trường 3D / Virtual Production",
    description: "Talkshow, Livestream bán hàng, TV show, Event – sân khấu ảo, Showroom ảo",
    icon: Video,
    image: setTalkshow,
    features: [
      { icon: Zap, text: "Realtime render" },
      { icon: Monitor, text: "Camera tracking" },
      { icon: Sun, text: "Ánh sáng tối ưu sẵn" },
      { icon: Move, text: "Dễ thay layout – vật liệu – brand" },
    ],
    cta: "Xem phim trường 3D",
    tags: ["Talkshow", "Livestream", "TV Show", "Event"],
  },
  {
    id: "2d-design",
    title: "Thiết Kế 2D",
    description: "Key visual chương trình, Backdrop sự kiện, Visual livestream, Layout màn LED, POSM & social visual",
    icon: Palette,
    image: setEvent,
    features: [
      { icon: Layers, text: "Đồng bộ với set 3D" },
      { icon: Image, text: "Dễ chuyển sang motion / 3D" },
      { icon: Zap, text: "Phù hợp triển khai nhanh" },
    ],
    cta: "Xem thiết kế 2D",
    tags: ["Key Visual", "Backdrop", "POSM", "Social"],
  },
  {
    id: "3d-models",
    title: "Model 3D / Asset",
    description: "Props sân khấu, Nội thất 3D, Background modular, Asset tối ưu UE5 / Blender",
    icon: Box,
    image: setLivestream,
    features: [
      { icon: Layers, text: "Asset nhỏ, nhẹ" },
      { icon: Move, text: "Dễ ráp thành scene lớn" },
      { icon: Zap, text: "Tối ưu performance" },
    ],
    cta: "Xem model 3D",
    tags: ["Props", "Nội thất", "Modular", "UE5"],
  },
];

const CategoriesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="categories" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-5" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Danh Mục <span className="gradient-text">Sản Phẩm</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Khám phá hệ sinh thái asset đa dạng – từ phim trường 3D, thiết kế 2D đến model 3D – 
            tất cả được tối ưu cho production chuyên nghiệp.
          </p>
        </motion.div>

        <div className="space-y-12">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`glass-card overflow-hidden card-hover group ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              } lg:flex`}
            >
              {/* Image */}
              <div className="relative lg:w-1/2 h-64 lg:h-auto overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-card via-card/50 to-transparent" />
                
                {/* Category Icon Overlay */}
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>

                {/* Tags */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                  {category.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium bg-primary/20 backdrop-blur-sm rounded-full text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col justify-center">
                <h3 className="font-display text-2xl lg:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-muted-foreground mb-6 text-lg">{category.description}</p>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {category.features.map((feature) => (
                    <div key={feature.text} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex flex-wrap gap-3">
                  <Button variant="hero" size="lg">
                    {category.cta}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="lg">
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
