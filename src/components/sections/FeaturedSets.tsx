import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Zap, Sun, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import setTalkshow from "@/assets/set-talkshow.jpg";
import setLivestream from "@/assets/set-livestream.jpg";
import setEvent from "@/assets/set-event.jpg";
import setNews from "@/assets/set-news.jpg";

const sets = [
  {
    id: 1,
    name: "Talkshow Studio Premium",
    image: setTalkshow,
    description: "Phim trường 3D sang trọng dành cho talkshow, podcast và chương trình phỏng vấn cao cấp.",
    tags: ["Talkshow", "Podcast", "Interview"],
    features: ["Render realtime", "Tối ưu ánh sáng", "Dễ thay đổi bố cục"],
  },
  {
    id: 2,
    name: "Livestream Commerce Hub",
    image: setLivestream,
    description: "Không gian livestream bán hàng hiện đại với khu vực trưng bày sản phẩm linh hoạt.",
    tags: ["Livestream", "E-commerce", "Shopping"],
    features: ["Render realtime", "Tối ưu ánh sáng", "Dễ thay đổi bố cục"],
  },
  {
    id: 3,
    name: "Event Stage Pro",
    image: setEvent,
    description: "Sân khấu sự kiện hoành tráng với LED wall và hệ thống ánh sáng chuyên nghiệp.",
    tags: ["Event", "Conference", "Concert"],
    features: ["Render realtime", "Tối ưu ánh sáng", "Dễ thay đổi bố cục"],
  },
  {
    id: 4,
    name: "News Broadcast Studio",
    image: setNews,
    description: "Studio tin tức chuyên nghiệp với màn hình tương tác và bản đồ thế giới.",
    tags: ["News", "Broadcast", "TV Show"],
    features: ["Render realtime", "Tối ưu ánh sáng", "Dễ thay đổi bố cục"],
  },
];

const featureIcons: Record<string, typeof Zap> = {
  "Render realtime": Zap,
  "Tối ưu ánh sáng": Sun,
  "Dễ thay đổi bố cục": Move,
};

const FeaturedSets = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="featured" className="py-24 relative overflow-hidden" ref={ref}>
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
            Phim Trường 3D <span className="gradient-text">Nổi Bật</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Khám phá bộ sưu tập phim trường 3D được thiết kế chuyên nghiệp, 
            sẵn sàng cho mọi dự án sản xuất nội dung của bạn.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sets.map((set, index) => (
            <motion.div
              key={set.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="glass-card overflow-hidden card-hover group"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={set.image}
                  alt={set.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                
                {/* Tags */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {set.tags.map((tag) => (
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
              <div className="p-6">
                <h3 className="font-display text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {set.name}
                </h3>
                <p className="text-muted-foreground mb-4">{set.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-4 mb-6">
                  {set.features.map((feature) => {
                    const Icon = featureIcons[feature] || Zap;
                    return (
                      <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon className="w-4 h-4 text-primary" />
                        <span>{feature}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button variant="default" size="sm">
                    Xem chi tiết
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Dùng thử
                  </Button>
                  <Button variant="glow" size="sm">
                    Mua ngay
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

export default FeaturedSets;
