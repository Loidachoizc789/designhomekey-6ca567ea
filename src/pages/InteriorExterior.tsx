import { motion } from "framer-motion";
import { Home, Building2, Sun, Layers, Monitor, Move, Zap, Download, Phone, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const interiorItems = [
  {
    id: 1,
    title: "Căn Hộ Hiện Đại",
    description: "Render 3D phòng khách căn hộ cao cấp với ánh sáng tự nhiên",
    image: setNews,
    category: "Căn hộ",
  },
  {
    id: 2,
    title: "Văn Phòng Startup",
    description: "Thiết kế không gian làm việc mở, sáng tạo cho startup công nghệ",
    image: setTalkshow,
    category: "Văn phòng",
  },
  {
    id: 3,
    title: "Showroom Nội Thất",
    description: "Không gian trưng bày sản phẩm nội thất cao cấp",
    image: setLivestream,
    category: "Showroom",
  },
  {
    id: 4,
    title: "Biệt Thự Luxury",
    description: "Render nội thất biệt thự phong cách Indochine",
    image: setEvent,
    category: "Biệt thự",
  },
];

const exteriorItems = [
  {
    id: 1,
    title: "Mặt Tiền Biệt Thự",
    description: "Phối cảnh mặt tiền biệt thự 3 tầng phong cách hiện đại",
    image: setTalkshow,
    category: "Biệt thự",
  },
  {
    id: 2,
    title: "Khu Đô Thị Xanh",
    description: "Phối cảnh tổng thể khu đô thị với cảnh quan xanh",
    image: setEvent,
    category: "Khu đô thị",
  },
  {
    id: 3,
    title: "Sân Vườn Villa",
    description: "Thiết kế cảnh quan sân vườn villa nghỉ dưỡng",
    image: setLivestream,
    category: "Sân vườn",
  },
  {
    id: 4,
    title: "Nhà Phố 4 Tầng",
    description: "Render mặt tiền nhà phố kết hợp kinh doanh",
    image: setNews,
    category: "Nhà phố",
  },
];

const interiorFeatures = [
  {
    icon: Sun,
    title: "Ánh Sáng Tự Nhiên",
    description: "Tối ưu ánh sáng ngày và đêm cho không gian sống động",
  },
  {
    icon: Layers,
    title: "Vật Liệu Chân Thực",
    description: "PBR material với độ phân giải cao, chi tiết sắc nét",
  },
  {
    icon: Monitor,
    title: "VR Walkthrough",
    description: "Hỗ trợ xuất file VR để trải nghiệm thực tế ảo",
  },
  {
    icon: Move,
    title: "Dễ Chỉnh Sửa",
    description: "File 3D có thể chỉnh sửa màu sắc, vật liệu theo yêu cầu",
  },
];

const exteriorFeatures = [
  {
    icon: Sun,
    title: "Render Ngày/Đêm",
    description: "Phối cảnh với ánh sáng ban ngày và hoàng hôn",
  },
  {
    icon: Move,
    title: "Cảnh Quan Linh Hoạt",
    description: "Cây xanh, hồ nước, đường đi tùy chỉnh theo ý muốn",
  },
  {
    icon: Zap,
    title: "Tối Ưu Presentation",
    description: "Góc nhìn và ánh sáng tối ưu cho bài thuyết trình",
  },
  {
    icon: Layers,
    title: "Phong Cách Đa Dạng",
    description: "Hiện đại, tân cổ điển, tropical, minimalist...",
  },
];

const specs = [
  { label: "Software", value: "3Ds Max, SketchUp, Blender" },
  { label: "Render Engine", value: "V-Ray, Corona, Lumion" },
  { label: "Output", value: "4K - 8K Resolution" },
  { label: "Format", value: "JPG, PNG, PSD, TIFF" },
  { label: "Video", value: "MP4 Animation (option)" },
  { label: "VR Support", value: "Panorama 360°, VR Tour" },
];

const InteriorExterior = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") === "exterior" ? "exterior" : "interior";

  const { images: interiorDbImages, loading: interiorLoading } = useCategoryImages("noi-that");
  const { images: exteriorDbImages, loading: exteriorLoading } = useCategoryImages("ngoai-that");
  const { imageUrl: deliverablesImage } = useCategoryPageImage("noi-ngoai-that", "deliverables");

  const {
    pricing: interiorPricing,
    notes: interiorNotes,
    loading: interiorPricingLoading,
  } = useCategoryPricing("noi-that");
  const {
    pricing: exteriorPricing,
    notes: exteriorNotes,
    loading: exteriorPricingLoading,
  } = useCategoryPricing("ngoai-that");

  const interiorGalleryItems = interiorDbImages.length > 0
    ? interiorDbImages.map((img, index) => ({
        id: index + 1,
        title: img.title,
        description: img.description || "",
        image: img.image_url,
        category: "Nội Thất",
      }))
    : interiorItems;

  const exteriorGalleryItems = exteriorDbImages.length > 0
    ? exteriorDbImages.map((img, index) => ({
        id: index + 1,
        title: img.title,
        description: img.description || "",
        image: img.image_url,
        category: "Ngoại Thất",
      }))
    : exteriorItems;

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Thiết Kế Nội Ngoại Thất 3D - Render Căn Hộ, Biệt Thự | DesignHomeKey"
        description="Dịch vụ render 3D nội thất căn hộ, biệt thự, văn phòng và phối cảnh ngoại thất mặt tiền. Ánh sáng tự nhiên, vật liệu PBR chân thực, hỗ trợ VR walkthrough."
        keywords="thiết kế nội thất 3D, render nội thất, ngoại thất 3D, phối cảnh biệt thự, căn hộ 3D, VR walkthrough, DesignHomeKey"
        url="https://designhomekey.lovable.app/noi-ngoai-that"
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
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Home className="w-6 h-6 text-amber-400" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Thiết Kế <span className="gradient-text">Nội Ngoại Thất</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
              Render 3D nội thất căn hộ, biệt thự, văn phòng và phối cảnh ngoại thất – 
              chất lượng cao, hỗ trợ VR walkthrough.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild>
                <a href="tel:0862098408">
                  <Phone className="w-5 h-5" />
                  Liên hệ báo giá
                </a>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="#gallery">
                  <Play className="w-5 h-5" />
                  Xem dự án
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs Section */}
      <section id="gallery" className="py-24">
        <div className="section-container">
          <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="interior" className="flex items-center gap-2 text-base py-3">
                <Home className="w-4 h-4" />
                Nội Thất
              </TabsTrigger>
              <TabsTrigger value="exterior" className="flex items-center gap-2 text-base py-3">
                <Building2 className="w-4 h-4" />
                Ngoại Thất
              </TabsTrigger>
            </TabsList>

            <TabsContent value="interior">
              {/* Interior Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {interiorFeatures.map((feature, index) => (
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

              {/* Interior Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Dự Án <span className="gradient-text">Nội Thất</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Các dự án render nội thất đã thực hiện
                </p>
              </motion.div>

              {interiorLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                </div>
              ) : (
                <ProductGallery items={interiorGalleryItems} />
              )}
            </TabsContent>

            <TabsContent value="exterior">
              {/* Exterior Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {exteriorFeatures.map((feature, index) => (
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

              {/* Exterior Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Dự Án <span className="gradient-text">Ngoại Thất</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Các dự án phối cảnh ngoại thất đã thực hiện
                </p>
              </motion.div>

              {exteriorLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                </div>
              ) : (
                <ProductGallery items={exteriorGalleryItems} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Pricing (theo tab) */}
      <CategoryPricingDisplay
        pricing={currentTab === "interior" ? interiorPricing : exteriorPricing}
        notes={currentTab === "interior" ? interiorNotes : exteriorNotes}
        loading={currentTab === "interior" ? interiorPricingLoading : exteriorPricingLoading}
        categoryTitle={currentTab === "interior" ? "Nội thất 3D" : "Ngoại thất 3D"}
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
                  "Render ảnh tĩnh độ phân giải cao (4K-8K)",
                  "File 3D gốc có thể chỉnh sửa (option)",
                  "Video animation 360° (option)",
                  "VR Tour panorama (option)",
                  "Revisions theo yêu cầu (2-3 lần)",
                  "Export PSD layers (option)",
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
                  <a href="tel:0862098408">Liên hệ báo giá</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="mailto:designhomekey@gmail.com">Email tư vấn</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Types */}
      <section className="py-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Loại Hình <span className="gradient-text">Dự Án</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Home, label: "Căn Hộ" },
              { icon: Building2, label: "Biệt Thự" },
              { icon: Monitor, label: "Văn Phòng" },
              { icon: Layers, label: "Showroom" },
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

export default InteriorExterior;
