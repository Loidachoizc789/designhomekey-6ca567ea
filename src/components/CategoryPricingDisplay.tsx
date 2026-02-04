import { motion } from "framer-motion";
import { Check, X, RotateCcw } from "lucide-react";
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
      <section className="py-16 bg-card/30">
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
    <section className="py-16 bg-card/30">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 italic">
            Bảng Giá <span className="gradient-text">Tham Khảo</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Liên hệ để nhận báo giá chi tiết theo yêu cầu cụ thể của bạn.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Pricing Grid - 4 columns with fixed layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {pricing.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 flex flex-col"
              >
                <h3 className="font-display text-lg font-semibold text-primary mb-5 uppercase tracking-wide">
                  {group.service_name}
                </h3>
                <div className="space-y-4 flex-1">
                  {group.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground leading-relaxed">{item.label}</span>
                      <span className="text-base font-bold text-foreground">{item.price}</span>
                    </div>
                  ))}
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
              className="flex flex-wrap justify-center gap-3 mb-10"
            >
              {notes.includes.map((item, index) => (
                <span
                  key={`include-${index}`}
                  className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary"
                >
                  <Check className="w-4 h-4" />
                  {item}
                </span>
              ))}
              {notes.excludes.map((item, index) => (
                <span
                  key={`exclude-${index}`}
                  className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full bg-muted text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                  {item}
                </span>
              ))}
            </motion.div>
          )}

          {/* General Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 mb-10"
          >
            <h3 className="font-display text-xl font-bold text-center mb-6">
              Quy Định Chung
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {generalRules.map((rule) => (
                <div key={rule.label} className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">{rule.label}</p>
                  <p className="text-lg font-bold text-primary">{rule.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 py-6 text-lg"
              asChild
            >
              <a href="tel:0862098408">
                <RotateCcw className="w-5 h-5 mr-2" />
                Nhận báo giá chi tiết
              </a>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Tư vấn miễn phí · Báo giá trong 24h
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CategoryPricingDisplay;
