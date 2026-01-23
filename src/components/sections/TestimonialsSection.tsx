import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote: "Chúng tôi giảm hơn 50% chi phí sản xuất talkshow nhờ phim trường 3D. Chất lượng hình ảnh vượt xa mong đợi.",
    author: "Nguyễn Văn A",
    role: "Giám đốc sáng tạo, Studio XYZ",
    rating: 5,
  },
  {
    quote: "Set dựng nhanh, hình ảnh đẹp, dễ chỉnh theo brand. Đội ngũ hỗ trợ rất chuyên nghiệp.",
    author: "Trần Thị B",
    role: "Producer, Agency ABC",
    rating: 5,
  },
  {
    quote: "Rất phù hợp cho livestream bán hàng và sự kiện online. Khách hàng của chúng tôi rất ấn tượng với chất lượng.",
    author: "Lê Văn C",
    role: "CEO, E-commerce Platform",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-5" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Khách hàng nói gì về{" "}
            <span className="gradient-text">phim trường 3D</span>?
          </h2>
          <p className="text-lg text-muted-foreground">
            Hàng trăm studio, agency đã tin tưởng sử dụng giải pháp virtual production của chúng tôi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="glass-card p-8 card-hover relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-2">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <Quote className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg mb-6 text-foreground/90">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
