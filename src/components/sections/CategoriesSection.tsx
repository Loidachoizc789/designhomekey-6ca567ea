import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, Video, Palette, Box, Home, Film, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import setTalkshow from "@/assets/set-talkshow.jpg";
import setLivestream from "@/assets/set-livestream.jpg";
import setEvent from "@/assets/set-event.jpg";
import setNews from "@/assets/set-news.jpg";

// Default images fallback
const defaultImages: Record<string, string> = {
  "phim-truong-3d": setTalkshow,
  "thiet-ke-2d": setEvent,
  "model-3d": setLivestream,
  "noi-ngoai-that": setNews,
  "after-effects": setTalkshow,
};

// 5 main categories matching the homepage design
const defaultCategories = [
  {
    id: "3d-studios",
    slug: "phim-truong-3d",
    category: "VIRTUAL PRODUCTION",
    title: "Thiết Kế 3D",
    description: "Talkshow, Livestream bán hàng, TV show, Event – sân khấu ảo, Showroom ảo",
    icon: Video,
    image: setTalkshow,
    tags: ["Realtime render", "Camera tracking", "LED Wall ready"],
    link: "/phim-truong-3d",
  },
  {
    id: "2d-design",
    slug: "thiet-ke-2d",
    category: "BRANDING & VISUAL",
    title: "Thiết Kế 2D",
    description: "Key visual chương trình, Backdrop sự kiện, Visual livestream, Layout màn LED, POSM",
    icon: Palette,
    image: setEvent,
    tags: ["Đồng bộ set 3D", "Motion ready", "Multi-format"],
    link: "/thiet-ke-2d",
  },
  {
    id: "3d-models",
    slug: "model-3d",
    category: "PROPS & ENVIRONMENT",
    title: "Model 3D / Asset",
    description: "Props sân khấu, Nội thất 3D, Background modular, Asset tối ưu UE5 / Blender",
    icon: Box,
    image: setLivestream,
    tags: ["Lightweight", "Modular", "UE5 optimized"],
    link: "/model-3d",
  },
  {
    id: "interior-exterior",
    slug: "noi-ngoai-that",
    category: "ARCHITECTURAL VIZ",
    title: "Nội Ngoại Thất",
    description: "Render 3D nội thất căn hộ, biệt thự, văn phòng và phối cảnh ngoại thất mặt tiền",
    icon: Home,
    image: setNews,
    tags: ["4K Render", "VR ready", "Realistic lighting"],
    link: "/noi-ngoai-that",
  },
  {
    id: "motion-graphics",
    slug: "after-effects",
    category: "AFTER EFFECTS",
    title: "After Effects",
    description: "Motion logo, video quảng cáo, template AE, gói livestream visual, lower third",
    icon: Film,
    image: setTalkshow,
    tags: ["Motion logo", "Livestream pack", "Social video"],
    link: "/after-effects",
  },
];

const CategoriesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGridView, setIsGridView] = useState(false);
  const [categories, setCategories] = useState(defaultCategories);

  // Fetch category images from database
  useEffect(() => {
    const fetchCategoryImages = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("slug, home_image_url, description")
          .in("slug", ["phim-truong-3d", "thiet-ke-2d", "model-3d", "noi-ngoai-that", "after-effects"]);

        if (error) throw error;

        if (data && data.length > 0) {
          // Create a map of slug -> image_url
          const imageMap: Record<string, string> = {};
          const descMap: Record<string, string> = {};
          
          data.forEach((cat) => {
            if (cat.home_image_url) {
              imageMap[cat.slug] = cat.home_image_url;
            }
            if (cat.description) {
              descMap[cat.slug] = cat.description;
            }
          });

          // Update categories with database images
          setCategories((prev) =>
            prev.map((cat) => ({
              ...cat,
              image: imageMap[cat.slug] || defaultImages[cat.slug] || cat.image,
              description: descMap[cat.slug] || cat.description,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching category images:", err);
      }
    };

    fetchCategoryImages();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const currentCategory = categories[currentIndex];
  const prevIndex = (currentIndex - 1 + categories.length) % categories.length;
  const nextIndex = (currentIndex + 1) % categories.length;

  return (
    <section id="categories" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-5" />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">
            DỊCH VỤ CỦA CHÚNG TÔI
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Danh Mục <span className="gradient-text italic">Sản Phẩm</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Khám phá hệ sinh thái asset đa dạng – từ phim trường 3D, thiết kế 2D đến model 3D – tất cả
            được tối ưu cho production chuyên nghiệp.
          </p>
        </motion.div>

        {/* Carousel View with Peek Effect */}
        {!isGridView && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="relative flex items-center justify-center gap-4 lg:gap-8 overflow-visible px-4">
              {/* Previous Item - Blurred peek effect - pushed far left */}
              <motion.div
                key={`prev-${prevIndex}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 0.6, x: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden xl:flex absolute -left-8 2xl:-left-20 w-52 2xl:w-72 h-72 2xl:h-96 z-0 items-center"
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden blur-[4px] scale-[0.85] opacity-40 hover:opacity-60 transition-opacity">
                  <img
                    src={categories[prevIndex].image}
                    alt={categories[prevIndex].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
                </div>
              </motion.div>

              {/* Main Carousel Item */}
              <div className="max-w-4xl w-full relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Image */}
                  <div className="relative w-full lg:w-1/2 aspect-square max-w-md">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="relative w-full h-full"
                    >
                      <img
                        src={currentCategory.image}
                        alt={currentCategory.title}
                        className="w-full h-full object-cover rounded-2xl shadow-2xl"
                        loading="eager"
                        decoding="async"
                      />
                      {/* Icon overlay with glow effect */}
                      <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <currentCategory.icon className="w-6 h-6 text-primary" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <motion.div
                    key={`content-${currentIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full lg:w-1/2 text-center lg:text-left"
                  >
                    <span className="text-primary text-xs font-medium uppercase tracking-wider mb-2 block">
                      {currentCategory.category}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                      {currentCategory.title}
                    </h3>
                    <p className="text-muted-foreground text-base lg:text-lg mb-6">
                      {currentCategory.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">
                      {currentCategory.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-4 py-2 text-sm font-medium bg-primary/10 border border-primary/20 rounded-full text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-base" asChild>
                      <Link to={currentCategory.link}>
                        Xem chi tiết
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* Next Item - Blurred peek effect - pushed far right */}
              <motion.div
                key={`next-${nextIndex}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 0.6, x: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden xl:flex absolute -right-8 2xl:-right-20 w-52 2xl:w-72 h-72 2xl:h-96 z-0 items-center"
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden blur-[4px] scale-[0.85] opacity-40 hover:opacity-60 transition-opacity">
                  <img
                    src={categories[nextIndex].image}
                    alt={categories[nextIndex].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-background via-background/50 to-transparent" />
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {categories.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-border hover:bg-primary/50"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Toggle Grid View */}
        <div className="text-center mb-8">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full border-border text-base"
            onClick={() => setIsGridView(!isGridView)}
          >
            {isGridView ? "Thu gọn" : "Xem tất cả hạng mục"}
            <ChevronUp className={`w-4 h-4 ml-2 transition-transform ${isGridView ? "" : "rotate-180"}`} />
          </Button>
        </div>

        {/* Grid View */}
        {isGridView && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass-card overflow-hidden card-hover group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <span className="text-primary text-xs font-medium uppercase tracking-wider mb-2 block">
                    {category.category}
                  </span>
                  <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {category.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs bg-primary/10 border border-primary/20 rounded-full text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={category.link}
                    className="inline-flex items-center text-primary text-sm font-medium hover:underline"
                  >
                    Xem chi tiết
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
