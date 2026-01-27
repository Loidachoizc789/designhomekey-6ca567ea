import { motion } from "framer-motion";
import { ArrowLeft, Home, Building2, Sun, Layers, Monitor, Move, Zap, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductGallery from "@/components/ProductGallery";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
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
  {
    id: 5,
    title: "Phòng Ngủ Master",
    description: "Thiết kế phòng ngủ master với tone màu ấm áp",
    image: setNews,
    category: "Phòng ngủ",
  },
  {
    id: 6,
    title: "Kitchen Modern",
    description: "Nhà bếp hiện đại với island và tủ bếp âm tường",
    image: setTalkshow,
    category: "Nhà bếp",
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
  {
    id: 5,
    title: "Resort Bể Bơi",
    description: "Phối cảnh khu resort với bể bơi vô cực",
    image: setTalkshow,
    category: "Resort",
  },
  {
    id: 6,
    title: "Công Trình Công Cộng",
    description: "Render ngoại thất tòa nhà văn phòng hiện đại",
    image: setEvent,
    category: "Văn phòng",
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
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") === "exterior" ? "exterior" : "interior";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

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
                <Home className="w-8 h-8 text-primary" />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Thiết Kế <span className="gradient-text">Nội Ngoại Thất</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Render 3D nội thất căn hộ, biệt thự, văn phòng và phối cảnh ngoại thất – 
              chất lượng cao, hỗ trợ VR walkthrough.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-16">
        <div className="section-container">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="interior" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Nội Thất
              </TabsTrigger>
              <TabsTrigger value="exterior" className="flex items-center gap-2">
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

              <ProductGallery items={interiorItems} />
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

              <ProductGallery items={exteriorItems} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

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
                <Button variant="hero" asChild>
                  <a href="tel:0862098408">Liên hệ báo giá</a>
                </Button>
                <Button variant="outline" asChild>
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
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <cat.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="font-medium">{cat.label}</span>
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
