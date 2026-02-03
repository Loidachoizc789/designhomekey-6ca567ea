import { motion } from "framer-motion";
import { ArrowLeft, Film, Sparkles, Zap, Video, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProductGallery from "@/components/ProductGallery";
import CategoryNavbar from "@/components/CategoryNavbar";
import Footer from "@/components/sections/Footer";
import { useCategoryImages } from "@/hooks/useCategoryImages";
import { useCategoryPricing } from "@/hooks/useCategoryPricing";
import CategoryPricingDisplay from "@/components/CategoryPricingDisplay";
import setLivestream from "@/assets/set-livestream.jpg";
import setTalkshow from "@/assets/set-talkshow.jpg";
import setEvent from "@/assets/set-event.jpg";
import setNews from "@/assets/set-news.jpg";

const defaultGalleryItems = [
  {
    id: 1,
    title: "Logo Animation Premium",
    description: "Motion logo chuyên nghiệp với hiệu ứng ánh sáng và particle",
    image: setLivestream,
    category: "Logo Animation",
  },
  {
    id: 2,
    title: "Video Motion Social",
    description: "Video quảng cáo ngắn tối ưu cho các nền tảng mạng xã hội",
    image: setTalkshow,
    category: "Social Video",
  },
  {
    id: 3,
    title: "Intro LED Event",
    description: "Video trình chiếu LED sân khấu với hiệu ứng ấn tượng",
    image: setEvent,
    category: "LED Video",
  },
  {
    id: 4,
    title: "Lower Third Pack",
    description: "Bộ lower third cho livestream và TV show",
    image: setNews,
    category: "Livestream Pack",
  },
  {
    id: 5,
    title: "Transition Pack",
    description: "Hiệu ứng chuyển cảnh chuyên nghiệp cho video",
    image: setLivestream,
    category: "Transitions",
  },
  {
    id: 6,
    title: "Template Livestream",
    description: "Gói template hoàn chỉnh cho livestream bán hàng",
    image: setTalkshow,
    category: "Livestream Pack",
  },
];

const features = [
  {
    icon: Sparkles,
    title: "Hiệu Ứng Chuyên Nghiệp",
    description: "Motion graphics với hiệu ứng ánh sáng, particle và 3D tracking",
  },
  {
    icon: Zap,
    title: "Render Nhanh Chóng",
    description: "Tối ưu file project giúp render nhanh, tiết kiệm thời gian",
  },
  {
    icon: Video,
    title: "Đa Định Dạng",
    description: "Xuất file đa định dạng: MP4, MOV, GIF cho mọi nền tảng",
  },
  {
    icon: Play,
    title: "Dễ Chỉnh Sửa",
    description: "File AE có cấu trúc rõ ràng, dễ customize theo yêu cầu",
  },
];

const specs = [
  { label: "Software", value: "After Effects CC 2022+" },
  { label: "Resolution", value: "Full HD - 4K" },
  { label: "Frame Rate", value: "30/60 FPS" },
  { label: "Format", value: "AEP, MOV, MP4" },
  { label: "Plugins", value: "Element 3D, Trapcode" },
  { label: "Audio", value: "Có/Không bản quyền" },
];

const MotionGraphics = () => {
  const { images, loading } = useCategoryImages("after-effects");
  const { pricing, notes, loading: pricingLoading } = useCategoryPricing("after-effects");

  const galleryItems = images.length > 0 
    ? images.map((img, index) => ({
        id: index + 1,
        title: img.title,
        description: img.description || "",
        image: img.image_url,
        category: "Motion Graphics",
      }))
    : defaultGalleryItems;

  return (
    <div className="min-h-screen bg-background">
      <CategoryNavbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute inset-0 grid-pattern opacity-5" />

        <div className="section-container relative z-10">
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Về trang chủ
            </Link>
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Film className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
                  After Effects / <span className="gradient-text">Motion Graphics</span>
                </h1>
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Motion logo, video quảng cáo, template AE, gói livestream visual, lower third – 
              Tất cả được thiết kế chuyên nghiệp và dễ customize.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-card/30">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Thư Viện <span className="gradient-text">Motion</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Khám phá bộ sưu tập motion graphics và video effects chuyên nghiệp
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

      {/* Technical Specs */}
      <section className="py-16">
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
                  "File AE project gốc (có thể chỉnh sửa)",
                  "Video render chất lượng cao",
                  "Hướng dẫn customize chi tiết",
                  "Font và asset đi kèm",
                  "2 lần chỉnh sửa miễn phí",
                  "Hỗ trợ kỹ thuật qua Zalo/Email",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Play className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="hero" asChild>
                  <a href="tel:0862098408">Liên hệ đặt hàng</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="mailto:designhomekey@gmail.com">Email báo giá</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <CategoryPricingDisplay 
        pricing={pricing} 
        notes={notes} 
        loading={pricingLoading}
        categoryTitle="After Effects / Motion Graphics"
      />

      <Footer />
    </div>
  );
};

export default MotionGraphics;
