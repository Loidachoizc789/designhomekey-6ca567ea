import { motion } from "framer-motion";
import { Palette, Layers, Image, Zap, Phone, Mail, CheckCircle, Play } from "lucide-react";
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
import setEvent from "@/assets/set-event.jpg";
import setTalkshow from "@/assets/set-talkshow.jpg";
import setLivestream from "@/assets/set-livestream.jpg";
import setNews from "@/assets/set-news.jpg";

const designSamples = [
  {
    id: 1,
    title: "Key Visual Sự Kiện Ra Mắt Sản Phẩm",
    description: "Thiết kế key visual cho sự kiện ra mắt sản phẩm công nghệ với phong cách hiện đại, tối giản.",
    image: setEvent,
    category: "Key Visual",
  },
  {
    id: 2,
    title: "Backdrop Talkshow Doanh Nghiệp",
    description: "Backdrop 3D render cho chương trình talkshow nội bộ doanh nghiệp.",
    image: setTalkshow,
    category: "Backdrop",
  },
  {
    id: 3,
    title: "Visual Livestream Bán Hàng",
    description: "Bộ visual hoàn chỉnh cho kênh livestream bán hàng.",
    image: setLivestream,
    category: "Livestream",
  },
  {
    id: 4,
    title: "Layout Màn LED Sự Kiện",
    description: "Thiết kế layout nội dung cho màn LED sự kiện outdoor quy mô lớn.",
    image: setNews,
    category: "LED Layout",
  },
  {
    id: 5,
    title: "POSM & Social Visual",
    description: "Bộ ấn phẩm POSM và visual cho social media.",
    image: setEvent,
    category: "POSM",
  },
  {
    id: 6,
    title: "Visual Chương Trình TV Show",
    description: "Thiết kế bộ visual cho chương trình TV show.",
    image: setTalkshow,
    category: "TV Show",
  },
];

const deliverables = [
  "Key visual chương trình / sự kiện",
  "Backdrop sân khấu / studio",
  "Visual livestream (overlay, frame, lower third)",
  "Layout màn LED (indoor/outdoor)",
  "POSM: poster, standee, banner, wobbler",
  "Social visual: Facebook, Instagram, TikTok",
  "Motion graphic cơ bản",
  "File nguồn PSD/AI/Figma",
];

const features = [
  { icon: Layers, title: "Đồng bộ với set 3D", description: "Thiết kế 2D có thể chuyển đổi sang 3D hoặc motion dễ dàng" },
  { icon: Image, title: "Đa nền tảng", description: "Tối ưu cho LED, print, digital và social media" },
  { icon: Zap, title: "Triển khai nhanh", description: "Quy trình làm việc tối ưu, bàn giao đúng deadline" },
  { icon: Palette, title: "Tùy chỉnh linh hoạt", description: "Dễ dàng thay đổi màu sắc, logo theo brand guideline" },
];

const Design2D = () => {
  const { images, loading } = useCategoryImages("thiet-ke-2d");
  const { pricing, notes, loading: pricingLoading } = useCategoryPricing("thiet-ke-2d");
  const { imageUrl: deliverablesImage } = useCategoryPageImage("thiet-ke-2d", "deliverables");

  const galleryItems = images.length > 0
    ? images.map((img, index) => ({
        id: index + 1,
        title: img.title,
        description: img.description || "",
        image: img.image_url,
        category: "Thiết Kế 2D",
      }))
    : designSamples;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Thiết Kế 2D - Key Visual, Backdrop, POSM | DesignHomeKey"
        description="Dịch vụ thiết kế 2D chuyên nghiệp: Key visual sự kiện, backdrop talkshow, visual livestream, layout màn LED và POSM. Đồng bộ với set 3D, triển khai nhanh."
        keywords="thiết kế 2D, key visual, backdrop sự kiện, visual livestream, layout LED, POSM, thiết kế đồ họa, DesignHomeKey"
        url="https://designhomekey.lovable.app/thiet-ke-2d"
      />
      <CategoryNavbar />

      <main>
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <GalaxyBackground />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
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
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                  <Palette className="w-6 h-6 text-pink-400" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Thiết Kế <span className="gradient-text">2D Chuyên Nghiệp</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                Giải pháp thiết kế 2D toàn diện cho sự kiện, livestream và truyền thông: 
                từ key visual, backdrop đến POSM và social visual – đồng bộ với hệ sinh thái 3D.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="xl" asChild>
                  <a href="#contact">
                    <Phone className="w-5 h-5" />
                    Liên hệ báo giá
                  </a>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <a href="#gallery">
                    <Play className="w-5 h-5" />
                    Xem mẫu thiết kế
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
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
                  className="glass-card p-6 text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Mẫu <span className="gradient-text">Thiết Kế</span>
              </h2>
              <p className="text-muted-foreground">
                Một số dự án thiết kế 2D tiêu biểu. Click vào hình để xem chi tiết.
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
          categoryTitle="Thiết Kế 2D"
        />

        {/* Deliverables Section */}
        <section className="py-24 bg-card/50">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                  Sản Phẩm <span className="gradient-text">Bàn Giao</span>
                </h2>
                <p className="text-muted-foreground mb-8">
                  Danh sách các sản phẩm thiết kế 2D chúng tôi có thể cung cấp cho dự án của bạn.
                </p>

                <div className="grid gap-4">
                  {deliverables.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img 
                    src={deliverablesImage || setEvent} 
                    alt="Design samples" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-2xl -z-10" />
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section id="contact" className="py-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-card p-8 md:p-12 text-center max-w-3xl mx-auto"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Bắt đầu dự án <span className="gradient-text">Thiết Kế 2D</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Liên hệ ngay để nhận tư vấn và báo giá chi tiết cho dự án của bạn.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button variant="hero" size="xl" asChild>
                  <a href="tel:0862098408">
                    <Phone className="w-5 h-5" />
                    0862 098 408
                  </a>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <a href="mailto:designhomekey@gmail.com">
                    <Mail className="w-5 h-5" />
                    designhomekey@gmail.com
                  </a>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Zalo: 0862 098 408 · Phản hồi trong vòng 24h
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Design2D;
