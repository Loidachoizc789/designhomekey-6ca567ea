import { motion } from "framer-motion";
import { Check, X, Phone, Sparkles, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingItem {
  label: string;
  price: string;
}

interface CategoryPricing {
  id: string;
  service_name: string;
  items: PricingItem[];
  display_order: number;
}

interface PricingNotes {
  includes: string[];
  excludes: string[];
}

interface CategoryPricingDisplayProps {
  pricing: CategoryPricing[];
  notes: PricingNotes;
  loading: boolean;
  categoryTitle: string;
}

const generalRules = [
  { label: "Đặt cọc", value: "30–50%" },
  { label: "Chỉnh sửa miễn phí", value: "2 lần" },
  { label: "Sửa thêm", value: "200k – 400k / lần" },
  { label: "Deadline gấp", value: "+20–30%" },
];

const CategoryPricingDisplay = ({
  pricing,
  notes,
  loading,
  categoryTitle,
}: CategoryPricingDisplayProps) => {
  if (loading) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="section-container">
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (pricing.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-glow-secondary/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 grid-pattern opacity-5" />
      </div>

      <div className="section-container relative z-10">
        {/* Header with Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Tag className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Bảng Giá Ưu Đãi</span>
            <Sparkles className="w-4 h-4 text-primary" />
          </motion.div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Bảng Giá <span className="gradient-text">Tham Khảo</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Liên hệ để nhận báo giá chi tiết theo yêu cầu cụ thể của bạn.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {/* Pricing Grid - Enhanced Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {pricing.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                
                {/* Card */}
                <div className="relative h-full rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-6 overflow-hidden group-hover:border-primary/30 transition-all duration-300">
                  {/* Top gradient line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Service name with icon */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground uppercase tracking-wide">
                      {group.service_name}
                    </h3>
                  </div>
                  
                  {/* Pricing items */}
                  <div className="space-y-4">
                    {group.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex} 
                        className="flex flex-col gap-1 pb-4 border-b border-border/30 last:border-0 last:pb-0"
                      >
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          {item.label}
                        </span>
                        <span className="text-xl font-bold gradient-text">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Notes - Includes / Excludes */}
          {(notes.includes.length > 0 || notes.excludes.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {notes.includes.map((item, index) => (
                <motion.span
                  key={`include-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400"
                >
                  <Check className="w-4 h-4" />
                  {item}
                </motion.span>
              ))}
              {notes.excludes.map((item, index) => (
                <motion.span
                  key={`exclude-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (notes.includes.length + index) * 0.05 }}
                  className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full bg-muted/50 border border-border text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                  {item}
                </motion.span>
              ))}
            </motion.div>
          )}

          {/* General Rules - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 mb-12 overflow-hidden"
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-glow-secondary/5" />
            
            <h3 className="font-display text-2xl font-bold text-center mb-8 relative z-10">
              Quy Định <span className="text-primary">Chung</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              {generalRules.map((rule, index) => (
                <motion.div 
                  key={rule.label} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-5 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <p className="text-sm text-muted-foreground mb-2">{rule.label}</p>
                  <p className="text-xl font-bold text-primary">{rule.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex flex-col items-center gap-6 p-8 rounded-3xl bg-gradient-to-b from-primary/10 to-transparent border border-primary/20">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">Bạn cần báo giá chi tiết?</p>
                <p className="text-muted-foreground">Tư vấn miễn phí · Phản hồi trong 24h</p>
              </div>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-12 py-7 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                asChild
              >
                <a href="tel:0862098408">
                  <Phone className="w-5 h-5 mr-3" />
                  Nhận báo giá ngay
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CategoryPricingDisplay;
