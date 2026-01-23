import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Wallet, 
  Layers, 
  Expand, 
  Video, 
  Lightbulb,
  CheckCircle2 
} from "lucide-react";

const benefits = [
  {
    icon: Wallet,
    title: "Tiết kiệm chi phí thuê phim trường vật lý",
    description: "Giảm đáng kể chi phí thuê studio, nhân công dựng set và vận hành thiết bị.",
  },
  {
    icon: Layers,
    title: "Tạo nhiều bối cảnh từ một dự án",
    description: "Dễ dàng chuyển đổi giữa các cảnh khác nhau mà không cần thay đổi vị trí.",
  },
  {
    icon: Expand,
    title: "Dễ mở rộng concept theo yêu cầu",
    description: "Tùy chỉnh và mở rộng thiết kế theo brand guidelines của khách hàng.",
  },
  {
    icon: Video,
    title: "Phù hợp livestream, TV show, quảng cáo",
    description: "Đáp ứng mọi nhu cầu sản xuất từ livestream đến các chương trình truyền hình.",
  },
  {
    icon: Lightbulb,
    title: "Realtime lighting & camera tracking",
    description: "Hỗ trợ đầy đủ các tính năng virtual production hiện đại nhất.",
  },
];

const BenefitsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="benefits" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Lợi ích khi sử dụng{" "}
            <span className="gradient-text">Phim Trường 3D</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Tối ưu quy trình sản xuất, nâng cao chất lượng nội dung với giải pháp virtual production.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex gap-4 glass-card p-6 card-hover group"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
