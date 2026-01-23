import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Clock, Palette, Layers } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Giảm chi phí",
    description: "Tiết kiệm đáng kể so với dựng bối cảnh vật lý truyền thống",
  },
  {
    icon: Clock,
    title: "Tăng tốc sản xuất",
    description: "Rút ngắn thời gian từ ý tưởng đến sản phẩm hoàn thiện",
  },
  {
    icon: Palette,
    title: "Linh hoạt thay đổi",
    description: "Thay đổi không gian, màu sắc, ánh sáng chỉ trong vài phút",
  },
  {
    icon: Layers,
    title: "Chuẩn Virtual Production",
    description: "Tối ưu cho UE5 và hệ thống quay realtime chuyên nghiệp",
  },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-glow-secondary/5 rounded-full blur-3xl" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Vì sao chúng tôi tạo ra các{" "}
            <span className="gradient-text">phim trường 3D</span> này?
          </h2>
          <p className="text-lg text-muted-foreground">
            Chúng tôi chia sẻ và cung cấp các phim trường 3D nhằm giúp studio, agency 
            và cá nhân sản xuất nội dung chuyên nghiệp với chi phí tối ưu.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card p-6 card-hover group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
