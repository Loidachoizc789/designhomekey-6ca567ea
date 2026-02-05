import { motion } from "framer-motion";
import { Box, Layers, Move, Zap, Download, Settings, Palette, Monitor, Phone, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductGallery from "@/components/ProductGallery";
import CategoryNavbar from "@/components/CategoryNavbar";
import Footer from "@/components/sections/Footer";
import FloatingShapes from "@/components/FloatingShapes";
import GalaxyBackground from "@/components/GalaxyBackground";
import SEOHead from "@/components/SEOHead";
import { useCategoryImages } from "@/hooks/useCategoryImages";
import { useCategoryPricing } from "@/hooks/useCategoryPricing";
import { useCategoryPageImage } from "@/hooks/useCategoryPageImage";
import CategoryPricingDisplay from "@/components/CategoryPricingDisplay";
import setLivestream from "@/assets/set-livestream.jpg";
import setTalkshow from "@/assets/set-talkshow.jpg";
import setEvent from "@/assets/set-event.jpg";
import setNews from "@/assets/set-news.jpg";

const defaultGalleryItems = [
  {
    id: 1,
    title: "Props Sân Khấu Hiện Đại",
    description: "Bộ props sân khấu modular, dễ ráp nối cho các chương trình talkshow và event",
    image: setLivestream,
    category: "Props",
  },
  {
    id: 2,
    title: "Nội Thất Văn Phòng",
    description: "Set nội thất văn phòng hiện đại, tối ưu polygon cho realtime render",
    image: setTalkshow,
    category: "Nội thất",
  },
  {
    id: 3,
    title: "Background Modular City",
    description: "Hệ thống background thành phố modular, dễ customize theo yêu cầu",
    image: setEvent,
    category: "Background",
  },
  {
    id: 4,
    title: "Asset Thiên Nhiên",
    description: "Cây cối, đá, địa hình - tối ưu cho outdoor scene",
    image: setNews,
    category: "Nature",
  },
  {
    id: 5,
    title: "Furniture Pack Premium",
    description: "Bộ nội thất cao cấp với vật liệu PBR chất lượng cao",
    image: setLivestream,
    category: "Furniture",
  },
  {
    id: 6,
    title: "Lighting Props",
    description: "Đèn trang trí, đèn sân khấu với IES profile chuẩn",
    image: setTalkshow,
    category: "Lighting",
  },
];

const features = [
  {
    icon: Layers,
    title: "Asset Nhỏ, Nhẹ",
    description: "Tối ưu polygon và texture, đảm bảo performance cao nhất",
  },
  {
    icon: Move,
    title: "Dễ Ráp Thành Scene",
    description: "Thiết kế modular, dễ dàng kết hợp thành scene lớn",
  },
  {
    icon: Zap,
    title: "Tối Ưu Performance",
    description: "LOD system, Nanite-ready cho UE5",
  },
  {
    icon: Palette,
    title: "Vật Liệu PBR",
    description: "Material instances dễ customize màu sắc và texture",
  },
];

const specs = [
  { label: "Engine Support", value: "UE5.3+, Blender 4.0+" },
  { label: "Format", value: "FBX, UASSET, BLEND" },
  { label: "Texture", value: "2K - 4K PBR" },
  { label: "LOD Levels", value: "3-5 levels" },
  { label: "Collision", value: "Auto-generated" },
  { label: "Documentation", value: "Có hướng dẫn sử dụng" },
];

const Model3D = () => {
  const { images, loading } = useCategoryImages("model-3d");
  const { pricing, notes, loading: pricingLoading } = useCategoryPricing("model-3d");
  const { imageUrl: deliverablesImage } = useCategoryPageImage("model-3d", "deliverables");

  const galleryItems = images.length > 0
    ? images.map((img, index) => ({
        id: index + 1,
        title: img.title,
        description: img.description || "",
        image: img.image_url,
        category: "Model 3D",
      }))
    : defaultGalleryItems;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Model 3D & Assets - Props, Furniture, Background | DesignHomeKey"
        description="Dịch vụ tạo model 3D chuyên nghiệp: props sân khấu, nội thất, background modular. Tối ưu cho UE5 và Blender với PBR material và LOD system."
        keywords="model 3D, 3D assets, props sân khấu, nội thất 3D, background 3D, Unreal Engine assets, Blender model, DesignHomeKey"
        url="https://designhomekey.lovable.app/model-3d"
      />
      <CategoryNavbar />

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <GalaxyBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute inset-0 grid-pattern opacity-5" />
        <FloatingShapes />

        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Box className="w-6 h-6 text-orange-400" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Layers className="w-6 h-6 text-primary" />
              </div>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Model 3D / <span className="gradient-text">Asset</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
              Props sân khấu, Nội thất 3D, Background modular – Asset tối ưu cho UE5 / Blender, 
              sẵn sàng cho production chuyên nghiệp.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild>
                <a href="tel:0862098408">
                  <Phone className="w-5 h-5" />
                  Liên hệ mua asset
                </a>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="#gallery">
                  <Play className="w-5 h-5" />
                  Xem thư viện
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-card/50">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 card-hover text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Thư Viện <span className="gradient-text">Asset</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Khám phá bộ sưu tập model 3D và asset được tối ưu cho production
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (
            <ProductGallery items={galleryItems} />
          )}
        </div>
      </section>

      {/* Pricing */}
      <CategoryPricingDisplay
        pricing={pricing}
        notes={notes}
        loading={pricingLoading}
        categoryTitle="Model 3D / Asset"
      />

      {/* Technical Specs */}
      <section className="py-16 bg-card/30">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Thông Số <span className="gradient-text">Kỹ Thuật</span>
              </h2>
              <div className="space-y-4">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between p-4 glass-card"
                  >
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-semibold text-primary">{spec.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <h3 className="font-display text-2xl font-bold mb-6">Bạn Sẽ Nhận Được</h3>
              <ul className="space-y-4">
                {[
                  "File FBX/UASSET/BLEND gốc",
                  "Texture PBR đầy đủ (Albedo, Normal, Roughness, Metallic)",
                  "Material instances có thể customize",
                  "LOD system tối ưu",
                  "Collision mesh sẵn sàng",
                  "Documentation hướng dẫn sử dụng",
                  "Hỗ trợ kỹ thuật qua Zalo/Email",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Download className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="hero" size="lg" asChild>
                  <a href="tel:0862098408">Liên hệ mua asset</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="mailto:designhomekey@gmail.com">Email báo giá</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Danh Mục <span className="gradient-text">Asset</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Box, label: "Props Sân Khấu" },
              { icon: Settings, label: "Nội Thất 3D" },
              { icon: Monitor, label: "Background" },
              { icon: Layers, label: "Modular Kit" },
            ].map((cat, index) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <cat.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="font-medium text-base">{cat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Model3D;
