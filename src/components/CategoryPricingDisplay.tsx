import { motion } from "framer-motion";
import { Check, X, MessageCircle } from "lucide-react";
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
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Bảng Giá <span className="gradient-text">Tham Khảo</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Giá tham khảo cho các dịch vụ {categoryTitle}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-card overflow-hidden">
            {pricing.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 ${index > 0 ? "border-t border-border" : ""}`}
              >
                <h3 className="font-display text-lg font-semibold text-primary mb-4">
                  {group.service_name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {group.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex justify-between items-center p-3 bg-card/50 rounded-lg"
                    >
                      <span className="text-sm text-foreground">{item.label}</span>
                      <span className="text-primary font-medium text-sm">{item.price}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Notes */}
            {(notes.includes.length > 0 || notes.excludes.length > 0) && (
              <div className="p-6 border-t border-border">
                <div className="flex flex-wrap gap-3">
                  {notes.includes.map((item, index) => (
                    <span
                      key={`include-${index}`}
                      className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {item}
                    </span>
                  ))}
                  {notes.excludes.map((item, index) => (
                    <span
                      key={`exclude-${index}`}
                      className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-muted text-muted-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
              asChild
            >
              <a href="tel:0862098408">
                <MessageCircle className="w-5 h-5 mr-2" />
                Liên hệ báo giá chi tiết
              </a>
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Tư vấn miễn phí · Báo giá trong 24h
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CategoryPricingDisplay;
