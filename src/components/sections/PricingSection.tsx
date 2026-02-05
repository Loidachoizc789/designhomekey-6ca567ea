import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronUp, Check, X, Palette, Video, Layers, Film, Home, Box, MessageCircle, Gift, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";

// Color configurations for each menu item
const iconColors = {
  "thiet-ke-2d": { bg: "bg-pink-500/20", text: "text-pink-400", glow: "shadow-pink-500/20" },
  "phim-truong-3d": { bg: "bg-cyan-500/20", text: "text-cyan-400", glow: "shadow-cyan-500/20" },
  "3d-event": { bg: "bg-orange-500/20", text: "text-orange-400", glow: "shadow-orange-500/20" },
  "motion-graphics": { bg: "bg-red-500/20", text: "text-red-400", glow: "shadow-red-500/20" },
  "noi-ngoai-that": { bg: "bg-green-500/20", text: "text-green-400", glow: "shadow-green-500/20" },
  "model-3d": { bg: "bg-purple-500/20", text: "text-purple-400", glow: "shadow-purple-500/20" },
};

const titleColors = {
  "thiet-ke-2d": "bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent",
  "phim-truong-3d": "text-foreground",
  "3d-event": "text-foreground",
  "motion-graphics": "bg-gradient-to-r from-cyan-400 to-primary bg-clip-text text-transparent",
  "noi-ngoai-that": "text-foreground",
  "model-3d": "text-foreground",
};

// Mapping from category slug to display info
const categoryConfig = [
  { slug: "thiet-ke-2d", icon: Palette, title: "I. Thiết Kế 2D – Nhận Diện Thương Hiệu" },
  { slug: "3d-virtual", icon: Video, title: "II. Phim Trường 3D / Virtual Production", displaySlug: "phim-truong-3d" },
  { slug: "3d-event", icon: Layers, title: "III. 3D Event – Sân Khấu – POSM" },
  { slug: "after-effects", icon: Film, title: "IV. After Effects / Motion Graphics", displaySlug: "motion-graphics" },
  { slug: "noi-that", icon: Home, title: "V. Thiết Kế Nội – Ngoại Thất (3D)", displaySlug: "noi-ngoai-that" },
  { slug: "model-3d", icon: Box, title: "VI. Model 3D / Asset" },
];

const generalRules = [
  { label: "Đặt cọc", value: "30–50%" },
  { label: "Chỉnh sửa miễn phí", value: "2 lần" },
  { label: "Sửa thêm", value: "200k – 400k / lần" },
  { label: "Deadline gấp", value: "+20–30%" },
];

interface PricingItem {
  label: string;
  price: string;
}

interface CategoryPricing {
  id: string;
  service_name: string;
  items: PricingItem[];
  display_order: number;
  category_slug: string;
}

interface PricingNotes {
  includes: string[];
  excludes: string[];
}

interface ComboPackage {
  id: string;
  name: string;
  description: string;
  price: string;
  includes: string[];
  color: string;
  is_active: boolean;
  display_order: number;
}

interface GroupedPricing {
  slug: string;
  displaySlug: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  services: CategoryPricing[];
  notes: PricingNotes;
}

const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openGroups, setOpenGroups] = useState<string[]>(["thiet-ke-2d"]);
  const [combos, setCombos] = useState<ComboPackage[]>([]);
  const [groupedPricing, setGroupedPricing] = useState<GroupedPricing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPricing = async () => {
      try {
        // Fetch all category pricing
        const { data: pricingData } = await supabase
          .from("category_pricing")
          .select("*")
          .order("display_order", { ascending: true });

        // Fetch all pricing notes
        const { data: notesData } = await supabase
          .from("category_pricing_notes")
          .select("*");

        // Group pricing by category
        const grouped: GroupedPricing[] = categoryConfig.map(config => {
          const categoryPricing = (pricingData || [])
            .filter(p => p.category_slug === config.slug)
            .map(p => ({
              ...p,
              items: Array.isArray(p.items) ? (p.items as unknown as PricingItem[]) : []
            }));

          const categoryNotes = notesData?.find(n => n.category_slug === config.slug);

          return {
            slug: config.slug,
            displaySlug: config.displaySlug || config.slug,
            icon: config.icon,
            title: config.title,
            services: categoryPricing,
            notes: {
              includes: categoryNotes?.includes || [],
              excludes: categoryNotes?.excludes || [],
            }
          };
        });

        setGroupedPricing(grouped.filter(g => g.services.length > 0));
      } catch (err) {
        console.error("Error fetching pricing:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCombos = async () => {
      const { data } = await supabase
        .from("combo_packages")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (data) setCombos(data);
    };

    fetchAllPricing();
    fetchCombos();

    // Realtime subscriptions
    const pricingChannel = supabase
      .channel("homepage-pricing-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "category_pricing" },
        () => fetchAllPricing()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "category_pricing_notes" },
        () => fetchAllPricing()
      )
      .subscribe();

    const comboChannel = supabase
      .channel("combo-packages-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "combo_packages" },
        () => fetchCombos()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(pricingChannel);
      supabase.removeChannel(comboChannel);
    };
  }, []);

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => 
      prev.includes(id) 
        ? prev.filter(g => g !== id)
        : [...prev, id]
    );
  };

  const parsePrice = (priceStr: string) => {
    const numbers = priceStr.match(/[\d.]+/g);
    if (numbers && numbers.length >= 2) {
      return { min: numbers[0], max: numbers[1] };
    }
    if (numbers && numbers.length === 1) {
      return { min: numbers[0], max: numbers[0] };
    }
    return { min: "0", max: "0" };
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-5" />

      <div className="section-container relative z-10">
        {/* Header - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            BẢNG GIÁ DỊCH VỤ
          </motion.span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4 italic">
            Menu Giá
            <br />
            <span className="gradient-text">& Combo Trọn Gói</span>
          </h2>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="single" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 mb-10 bg-card border border-border rounded-full p-1.5 h-14">
            <TabsTrigger 
              value="single" 
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-base py-3"
            >
              <Palette className="w-5 h-5 mr-2" />
              Dịch vụ đơn lẻ
            </TabsTrigger>
            <TabsTrigger 
              value="combo"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-base py-3"
            >
              <Gift className="w-5 h-5 mr-2" />
              Combo Trọn Gói
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Đang tải bảng giá...</p>
              </div>
            ) : groupedPricing.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Chưa có dữ liệu bảng giá</p>
              </div>
            ) : (
              groupedPricing.map((group, index) => {
                const colors = iconColors[group.displaySlug as keyof typeof iconColors] || iconColors["thiet-ke-2d"];
                const titleColor = titleColors[group.displaySlug as keyof typeof titleColors] || "";
                const IconComponent = group.icon;
                
                return (
                  <motion.div
                    key={group.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Collapsible 
                      open={openGroups.includes(group.slug)}
                      onOpenChange={() => toggleGroup(group.slug)}
                    >
                      <div className="glass-card overflow-hidden">
                        <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-primary/5 transition-colors">
                          <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center shadow-lg ${colors.glow}`}>
                              <IconComponent className={`w-7 h-7 ${colors.text}`} />
                            </div>
                            <div className="text-left">
                              <h3 className={`font-display text-xl md:text-2xl font-bold ${titleColor}`}>
                                {group.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">{group.services.length} nhóm dịch vụ</p>
                            </div>
                          </div>
                          <ChevronUp className={`w-6 h-6 text-muted-foreground transition-transform ${openGroups.includes(group.slug) ? "" : "rotate-180"}`} />
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <div className="px-6 pb-6 border-t border-border pt-6">
                            {/* Services grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {group.services.map((service) => (
                                <div key={service.id} className="glass-card p-4 border border-border/50">
                                  <h4 className="text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                                    {service.service_name}
                                  </h4>
                                  <div className="space-y-3">
                                    {service.items.map((item, itemIndex) => (
                                      <div key={itemIndex} className="flex justify-between items-start gap-2">
                                        <span className="text-sm text-muted-foreground">{item.label}</span>
                                        <span className="text-sm font-medium text-foreground whitespace-nowrap">{item.price}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Includes / Excludes */}
                            {(group.notes.includes.length > 0 || group.notes.excludes.length > 0) && (
                              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-border/50">
                                {group.notes.includes.map((item) => (
                                  <span key={item} className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                                    <Check className="w-3.5 h-3.5" />
                                    {item}
                                  </span>
                                ))}
                                {group.notes.excludes.map((item) => (
                                  <span key={item} className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                                    <X className="w-3.5 h-3.5" />
                                    {item}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  </motion.div>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="combo">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
                Combo Event <span className="gradient-text">Trọn Gói</span>
              </h3>
              <p className="text-muted-foreground">
                Gói tổng thể cho sự kiện từ nhỏ đến lớn
              </p>
            </motion.div>

            {/* Combo Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {combos.length > 0 ? (
                combos.map((combo, index) => {
                  const price = parsePrice(combo.price);
                  return (
                    <motion.div
                      key={combo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="glass-card p-6 card-hover relative overflow-hidden"
                    >
                      {index === 1 && (
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                          Phổ biến nhất
                        </div>
                      )}
                      
                      <div 
                        className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center bg-gradient-to-r ${combo.color || "from-cyan-500 to-blue-500"}`}
                      >
                        <Gift className="w-8 h-8 text-white" />
                      </div>
                      
                      <h4 className="font-display text-xl font-bold mb-2">{combo.name}</h4>
                      <p className="text-muted-foreground text-sm mb-4">{combo.description}</p>
                      
                      <div className="mb-4">
                        <span className="font-display text-2xl font-bold gradient-text">{price.min}</span>
                        <span className="text-muted-foreground mx-2">–</span>
                        <span className="font-display text-2xl font-bold gradient-text">{price.max}</span>
                        <span className="text-muted-foreground text-sm">đ</span>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {combo.includes.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>

                      <Button variant="outline" className="w-full rounded-full" asChild>
                        <a href="#contact">
                          Liên hệ báo giá
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </motion.div>
                  );
                })
              ) : (
                // Default combo cards if no data
                [
                  { name: "Combo A", price: "18.000.000đ", desc: "Sân khấu + POSM + Motion intro" },
                  { name: "Combo B", price: "35.000.000đ", desc: "Sân khấu + Photobooth + Video LED" },
                  { name: "Combo C", price: "60.000.000đ", desc: "Fullpack event: Concept + 3D + Motion" },
                  { name: "Combo D", price: "90.000.000đ", desc: "Enterprise: All-in-one solution" },
                ].map((combo, index) => (
                  <motion.div
                    key={combo.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass-card p-6 card-hover"
                  >
                    <h4 className="font-display text-xl font-bold mb-2 gradient-text">{combo.name}</h4>
                    <p className="text-muted-foreground text-sm mb-4">{combo.desc}</p>
                    <p className="font-display text-2xl font-bold gradient-text mb-4">{combo.price}</p>
                    <Button variant="outline" className="w-full rounded-full" asChild>
                      <a href="#contact">Liên hệ</a>
                    </Button>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* General Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="glass-card p-6 md:p-8">
            <h3 className="font-display text-xl font-bold text-center mb-6">
              Quy Định Chung
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {generalRules.map((rule) => (
                <div key={rule.label} className="text-center p-4 rounded-xl bg-card/50">
                  <p className="text-sm text-muted-foreground mb-1">{rule.label}</p>
                  <p className="font-bold text-primary text-lg">{rule.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <Button variant="hero" size="xl" asChild>
              <a href="#contact">
                <MessageCircle className="w-5 h-5" />
                Nhận báo giá chi tiết
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
