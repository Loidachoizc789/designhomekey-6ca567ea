import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronUp, Check, X, Palette, Video, Layers, Film, Home, Box, MessageCircle, Gift, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";

const pricingGroups = [
  {
    id: "thiet-ke-2d",
    icon: Palette,
    title: "I. Thiết Kế 2D – Nhận Diện Thương Hiệu",
    subtitle: "4 nhóm dịch vụ",
    items: [
      { name: "Logo", price: "2.000.000 – 4.000.000đ" },
      { name: "Poster / Banner", price: "500.000 – 1.500.000đ" },
      { name: "Standee", price: "600.000 – 2.000.000đ" },
      { name: "Brochure / Flyer", price: "1.000.000 – 3.000.000đ" },
      { name: "Catalogue", price: "4.000.000 – 10.000.000đ" },
    ],
    combos: [
      { name: "COMBO 2D START", desc: "Logo + Namecard + Avatar + Cover Facebook", price: "6.000.000 – 8.000.000đ" },
      { name: "COMBO 2D BRAND BASIC", desc: "Logo + Bộ nhận diện + Poster + 3 post social", price: "10.000.000 – 12.000.000đ" },
      { name: "COMBO 2D BRAND PRO", desc: "Logo + Brand guideline + POSM + Template + Hồ sơ NL", price: "15.000.000 – 20.000.000đ" },
    ],
    includes: ["File AI, PDF, JPG, PNG", "2 lần chỉnh sửa"],
    excludes: ["Chi phí in ấn"],
  },
  {
    id: "phim-truong-3d",
    icon: Video,
    title: "II. Phim Trường 3D / Virtual Production",
    subtitle: "4 nhóm dịch vụ",
    items: [
      { name: "Phim trường 3D đơn", price: "6.000.000 – 10.000.000đ" },
      { name: "Phim trường theo concept", price: "12.000.000 – 18.000.000đ" },
      { name: "Virtual Production nâng cao", price: "25.000.000 – 40.000.000đ" },
    ],
    combos: [
      { name: "COMBO VP BASIC", desc: "1 phim trường + Backdrop + Camera cố định", price: "8.000.000 – 12.000.000đ" },
      { name: "COMBO VP STANDARD", desc: "1–2 không gian + Concept + Camera cinematic", price: "15.000.000 – 20.000.000đ" },
      { name: "COMBO VP PRO", desc: "2–3 không gian + Virtual Production + Test kỹ thuật", price: "28.000.000 – 40.000.000đ" },
    ],
    includes: ["Render realtime Unreal / Aximmetry", "File scene + ảnh preview", "Dùng cho livestream, talkshow, quảng cáo"],
    excludes: ["Vận hành quay thực tế", "Thiết bị ánh sáng", "Sửa thêm: 200k–400k/lần"],
  },
  {
    id: "3d-event",
    icon: Layers,
    title: "III. 3D Event – Sân Khấu – POSM",
    subtitle: "4 nhóm dịch vụ",
    items: [
      { name: "Sân khấu 3D", price: "5.000.000 – 15.000.000đ" },
      { name: "POSM 3D", price: "800.000 – 2.000.000đ / món" },
      { name: "Photobooth 3D", price: "2.000.000 – 5.000.000đ" },
      { name: "Gate / Cổng chào 3D", price: "3.000.000 – 8.000.000đ" },
      { name: "Booth triển lãm", price: "5.000.000 – 15.000.000đ" },
    ],
    combos: [
      { name: "COMBO EVENT MINI", desc: "Sân khấu + Backdrop LED + 2–3 POSM", price: "10.000.000 – 15.000.000đ" },
      { name: "COMBO EVENT STANDARD", desc: "Sân khấu + Layout + POSM + Photobooth", price: "18.000.000 – 30.000.000đ" },
      { name: "COMBO EVENT PRO", desc: "Concept tổng thể + Sân khấu + Gate + Booth + Render", price: "35.000.000 – 60.000.000đ" },
    ],
    includes: ["Dùng để pitching, duyệt phương án", "Render ảnh/video"],
    excludes: ["Thi công thực tế"],
  },
  {
    id: "motion-graphics",
    icon: Film,
    title: "IV. After Effects / Motion Graphics",
    subtitle: "4 nhóm dịch vụ",
    items: [
      { name: "Logo animation", price: "1.500.000 – 3.000.000đ" },
      { name: "Video motion social", price: "3.000.000 – 6.000.000đ" },
      { name: "Video trình chiếu LED", price: "8.000.000 – 15.000.000đ" },
    ],
    combos: [
      { name: "COMBO MOTION BASIC", desc: "Logo animation + Motion text", price: "3.000.000 – 5.000.000đ" },
      { name: "COMBO MOTION EVENT", desc: "Video intro LED + Motion sân khấu", price: "6.000.000 – 10.000.000đ" },
      { name: "COMBO MOTION PRO", desc: "Motion phức tạp + Video trình chiếu lớn", price: "12.000.000 – 20.000.000đ" },
    ],
    includes: ["Thời lượng 5–30s", "2 lần chỉnh sửa"],
    excludes: ["Nhạc bản quyền"],
  },
  {
    id: "noi-ngoai-that",
    icon: Home,
    title: "V. Thiết Kế Nội – Ngoại Thất (3D)",
    subtitle: "3 nhóm dịch vụ",
    items: [
      { name: "1 view nội thất", price: "700.000 – 1.200.000đ" },
      { name: "4 view nội thất", price: "3.000.000 – 5.000.000đ" },
      { name: "6 view nội thất", price: "5.000.000 – 8.000.000đ" },
    ],
    exteriorItems: [
      { name: "Nhà phố ngoại thất", price: "3.000.000 – 6.000.000đ" },
      { name: "Biệt thự ngoại thất", price: "6.000.000 – 12.000.000đ" },
      { name: "Phối cảnh dự án nhỏ", price: "12.000.000 – 25.000.000đ" },
    ],
    animationItems: [
      { name: "Flythrough 10–15s", price: "3.000.000 – 6.000.000đ" },
      { name: "Flythrough 20–30s", price: "6.000.000 – 12.000.000đ" },
    ],
    includes: ["Render 4K", "File PSD layer"],
    excludes: ["VR Tour"],
  },
  {
    id: "model-3d",
    icon: Box,
    title: "VI. Model 3D / Asset",
    subtitle: "2 nhóm dịch vụ",
    items: [
      { name: "Props đơn giản", price: "300.000 – 700.000đ" },
      { name: "Props chi tiết", price: "800.000 – 2.000.000đ" },
      { name: "Asset clean (dùng animation)", price: "2.000.000 – 4.000.000đ" },
    ],
    studioItems: [
      { name: "Không gian 3D nhỏ", price: "2.000.000 – 4.000.000đ" },
      { name: "Booth / studio 3D", price: "4.000.000 – 8.000.000đ" },
      { name: "Background modular", price: "6.000.000 – 10.000.000đ" },
    ],
    includes: ["File Blender / FBX / UE", "Texture maps"],
    excludes: ["Rigging", "Animation"],
  },
];

const generalRules = [
  { label: "Đặt cọc", value: "30–50%" },
  { label: "Chỉnh sửa miễn phí", value: "2 lần" },
  { label: "Sửa thêm", value: "200k – 400k / lần" },
  { label: "Deadline gấp", value: "+20–30%" },
];

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

const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openGroups, setOpenGroups] = useState<string[]>(["thiet-ke-2d"]);
  const [combos, setCombos] = useState<ComboPackage[]>([]);

  useEffect(() => {
    const fetchCombos = async () => {
      const { data } = await supabase
        .from("combo_packages")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (data) setCombos(data);
    };
    fetchCombos();

    // Realtime subscription
    const channel = supabase
      .channel("combo-packages-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "combo_packages" },
        () => fetchCombos()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => 
      prev.includes(id) 
        ? prev.filter(g => g !== id)
        : [...prev, id]
    );
  };

  // Parse price to get min/max
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 italic">
            Menu Giá{" "}
            <br className="sm:hidden" />
            <span className="gradient-text">& Combo Trọn Gói</span>
          </h2>
          <p className="text-muted-foreground">
            Studio Design 2D – 3D – Event – Motion
            <br />
            Studio nhỏ 1–3 người · Thị trường Việt Nam
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="single" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-card border border-border rounded-full p-1">
            <TabsTrigger 
              value="single" 
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Palette className="w-4 h-4 mr-2" />
              Dịch vụ đơn lẻ
            </TabsTrigger>
            <TabsTrigger 
              value="combo"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Gift className="w-4 h-4 mr-2" />
              Combo Trọn Gói
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4">
            {pricingGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Collapsible 
                  open={openGroups.includes(group.id)}
                  onOpenChange={() => toggleGroup(group.id)}
                >
                  <div className="glass-card overflow-hidden">
                    <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-primary/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                          <group.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-display text-lg font-semibold text-primary">
                            {group.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{group.subtitle}</p>
                        </div>
                      </div>
                      <ChevronUp className={`w-5 h-5 transition-transform ${openGroups.includes(group.id) ? "" : "rotate-180"}`} />
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-6 pb-6 border-t border-border pt-6">
                        {/* Main pricing grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {/* Giá lẻ column */}
                          <div>
                            <h4 className="text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                              Giá Lẻ
                            </h4>
                            <div className="space-y-3">
                              {group.items.map((item) => (
                                <div key={item.name} className="flex justify-between items-start gap-2">
                                  <span className="text-sm text-muted-foreground">{item.name}</span>
                                  <span className="text-sm font-medium text-foreground whitespace-nowrap">{item.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Combo columns */}
                          {group.combos?.map((combo) => (
                            <div key={combo.name} className="glass-card p-4 border border-border/50">
                              <h4 className="text-primary font-semibold mb-2 text-sm uppercase tracking-wider">
                                {combo.name}
                              </h4>
                              <p className="text-sm text-muted-foreground mb-3">{combo.desc}</p>
                              <p className="text-primary font-bold">{combo.price}</p>
                            </div>
                          ))}

                          {/* Interior section specific columns */}
                          {group.exteriorItems && (
                            <div>
                              <h4 className="text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                                Ngoại thất
                              </h4>
                              <div className="space-y-3">
                                {group.exteriorItems.map((item) => (
                                  <div key={item.name} className="flex justify-between items-start gap-2">
                                    <span className="text-sm text-muted-foreground">{item.name}</span>
                                    <span className="text-sm font-medium text-foreground whitespace-nowrap">{item.price}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {group.animationItems && (
                            <div>
                              <h4 className="text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                                Animation
                              </h4>
                              <div className="space-y-3">
                                {group.animationItems.map((item) => (
                                  <div key={item.name} className="flex justify-between items-start gap-2">
                                    <span className="text-sm text-muted-foreground">{item.name}</span>
                                    <span className="text-sm font-medium text-foreground whitespace-nowrap">{item.price}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {group.studioItems && (
                            <div>
                              <h4 className="text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
                                Không gian / Studio
                              </h4>
                              <div className="space-y-3">
                                {group.studioItems.map((item) => (
                                  <div key={item.name} className="flex justify-between items-start gap-2">
                                    <span className="text-sm text-muted-foreground">{item.name}</span>
                                    <span className="text-sm font-medium text-foreground whitespace-nowrap">{item.price}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Includes / Excludes */}
                        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-border/50">
                          {group.includes.map((item) => (
                            <span key={item} className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                              <Check className="w-3.5 h-3.5" />
                              {item}
                            </span>
                          ))}
                          {group.excludes.map((item) => (
                            <span key={item} className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                              <X className="w-3.5 h-3.5" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </motion.div>
            ))}
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
                  const { min, max } = parsePrice(combo.price);
                  const isPopular = index === 1; // Middle card is "most popular"

                  return (
                    <motion.div
                      key={combo.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                      className={`glass-card p-6 relative ${isPopular ? "ring-2 ring-primary" : ""}`}
                    >
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                            <Sparkles className="w-3 h-3" />
                            Phổ biến nhất
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${combo.color} flex items-center justify-center`}>
                          <Gift className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-lg">{combo.name}</h4>
                          <p className="text-sm text-muted-foreground">{combo.description}</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl md:text-3xl font-bold gradient-text">{min}</span>
                          <span className="text-muted-foreground">–</span>
                        </div>
                        <div className="text-xl md:text-2xl font-bold text-primary">
                          {max}đ
                        </div>
                        <p className="text-xs text-muted-foreground uppercase mt-1">
                          Tùy theo scope dự án
                        </p>
                      </div>

                      {/* Includes */}
                      <div className="space-y-3 mb-6">
                        <p className="text-xs uppercase text-muted-foreground font-medium">Bao gồm</p>
                        {combo.includes.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <Button 
                        className="w-full rounded-full" 
                        variant={isPopular ? "default" : "outline"}
                        asChild
                      >
                        <a href="#contact">
                          Liên hệ báo giá
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </motion.div>
                  );
                })
              ) : (
                // Default combo cards if no data from DB
                <>
                  {[
                    { name: "COMBO EVENT START", desc: "Event nhỏ – tiết kiệm chi phí", min: "18.000.000", max: "25.000.000", includes: ["KV 2D", "Sân khấu 3D", "POSM cơ bản", "Motion intro"] },
                    { name: "COMBO EVENT FULL", desc: "Gói bán chạy nhất", min: "35.000.000", max: "50.000.000", includes: ["Concept 2D", "Sân khấu + Gate + Booth", "POSM đầy đủ", "Video trình chiếu"] },
                    { name: "COMBO EVENT PREMIUM", desc: "Event lớn, agency, thương hiệu mạnh", min: "60.000.000", max: "90.000.000", includes: ["Branding event", "Virtual Production", "Full POSM", "Motion + Video 3D"] },
                  ].map((combo, index) => {
                    const isPopular = index === 1;
                    return (
                      <motion.div
                        key={combo.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.15 }}
                        className={`glass-card p-6 relative ${isPopular ? "ring-2 ring-primary" : ""}`}
                      >
                        {isPopular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                              <Sparkles className="w-3 h-3" />
                              Phổ biến nhất
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                            <Gift className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-lg">{combo.name}</h4>
                            <p className="text-sm text-muted-foreground">{combo.desc}</p>
                          </div>
                        </div>

                        <div className="mb-6">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl md:text-3xl font-bold gradient-text">{combo.min}</span>
                            <span className="text-muted-foreground">–</span>
                          </div>
                          <div className="text-xl md:text-2xl font-bold text-primary">
                            {combo.max}đ
                          </div>
                          <p className="text-xs text-muted-foreground uppercase mt-1">
                            Tùy theo scope dự án
                          </p>
                        </div>

                        <div className="space-y-3 mb-6">
                          <p className="text-xs uppercase text-muted-foreground font-medium">Bao gồm</p>
                          {combo.includes.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-primary flex-shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>

                        <Button 
                          className="w-full rounded-full" 
                          variant={isPopular ? "default" : "outline"}
                          asChild
                        >
                          <a href="#contact">
                            Liên hệ báo giá
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      </motion.div>
                    );
                  })}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* General Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-5xl mx-auto mt-12"
        >
          <div className="glass-card p-8">
            <h3 className="text-center font-display text-xl font-semibold mb-6">
              Quy Định Chung
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {generalRules.map((rule) => (
                <div key={rule.label} className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
                  <div className="text-muted-foreground text-sm mb-1">{rule.label}</div>
                  <div className="text-primary font-semibold">{rule.value}</div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                asChild
              >
                <a href="tel:0862098408">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Liên hệ báo giá: 0862 098 408
                </a>
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Tư vấn miễn phí · Báo giá trong 24h
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
