import { Quote, Star, Mic, Users, ShoppingBag, Tv, Megaphone } from "lucide-react";

const useCases = [
  { icon: Mic, title: "Talkshow livestream cố định & lưu động" },
  { icon: Users, title: "Sự kiện online – hybrid" },
  { icon: ShoppingBag, title: "Livestream bán hàng" },
  { icon: Tv, title: "TV show – chương trình nội bộ" },
  { icon: Megaphone, title: "Quảng cáo – presentation sản phẩm" },
];

const testimonials = [
  {
    quote: "Set dựng nhanh, chỉnh layout rất linh hoạt. Tiết kiệm được rất nhiều thời gian setup.",
    author: "Nguyễn Văn A",
    role: "Giám đốc sáng tạo, Studio XYZ",
    rating: 5,
  },
  {
    quote: "Một phim trường dùng được cho nhiều brand. ROI rất cao so với thuê studio vật lý.",
    author: "Trần Thị B",
    role: "Producer, Agency ABC",
    rating: 5,
  },
  {
    quote: "Asset nhẹ, chạy realtime ổn định. Phù hợp livestream bán hàng và sự kiện online.",
    author: "Lê Văn C",
    role: "CEO, E-commerce Platform",
    rating: 5,
  },
];

const UseCasesSection = () => {
  return (
    <section id="use-cases" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-5" />

      <div className="section-container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Ứng dụng thực tế</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Hàng trăm studio, agency đã tin tưởng sử dụng giải pháp virtual production của chúng tôi.
          </p>
        </div>

        {/* Use Cases */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {useCases.map((useCase) => (
            <div key={useCase.title} className="glass-card px-6 py-4 flex items-center gap-3 card-hover">
              <useCase.icon className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">{useCase.title}</span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="glass-card p-8 card-hover relative">
              <div className="absolute -top-4 -left-2">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <Quote className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <div className="flex gap-1 mb-4 mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="text-lg mb-6 text-foreground/90">
                "{testimonial.quote}"
              </blockquote>
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
