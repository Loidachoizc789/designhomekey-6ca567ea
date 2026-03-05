import { 
  Wallet, 
  Lightbulb,
  Repeat,
  Expand,
  Video, 
  Layers,
  CheckCircle2 
} from "lucide-react";

const stats = [
  { value: "80%", label: "Tiết kiệm chi phí" },
  { value: "3x", label: "Nhanh hơn" },
  { value: "100+", label: "Dự án" },
];

const benefits = [
  {
    icon: Wallet,
    title: "Giảm chi phí dựng bối cảnh vật lý",
    description: "Tiết kiệm đáng kể chi phí thuê studio, nhân công dựng set và vận hành thiết bị.",
  },
  {
    icon: Lightbulb,
    title: "Tăng tốc độ sản xuất dự án",
    description: "Rút ngắn thời gian từ ý tưởng đến sản phẩm hoàn thiện chỉ trong vài giờ.",
  },
  {
    icon: Repeat,
    title: "Một asset dùng cho nhiều dự án",
    description: "Tái sử dụng linh hoạt cho nhiều khách hàng, tiết kiệm thời gian thiết kế.",
  },
  {
    icon: Expand,
    title: "Dễ scale từ nhỏ đến lớn",
    description: "Bắt đầu từ asset nhỏ, ráp thành dự án lớn theo nhu cầu thực tế.",
  },
  {
    icon: Video,
    title: "Phù hợp livestream, TV show, event, quảng cáo",
    description: "Đáp ứng mọi nhu cầu sản xuất từ livestream đến các chương trình truyền hình.",
  },
  {
    icon: Layers,
    title: "Realtime lighting & camera",
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

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Vì sao nên dùng{" "}
            <span className="gradient-text">Hệ sinh thái 3D</span>
            <br />
            <span className="gradient-text">& 2D</span> này?
          </h2>
          <p className="text-muted-foreground">
            Tối ưu quy trình sản xuất, nâng cao chất lượng nội dung với giải pháp virtual production toàn diện.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-8 sm:gap-16 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl sm:text-5xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="glass-card p-6 card-hover group flex gap-4"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-display text-base font-semibold mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
