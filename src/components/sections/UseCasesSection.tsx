import { Palette, Box, Boxes, Home, Film, Sparkles, Video, Building2, Layers, Wand2 } from "lucide-react";

const useCases = [
  { icon: Palette, title: "Thiết kế 2D", href: "/thiet-ke-2d" },
  { icon: Film, title: "Phim trường 3D", href: "/phim-truong-3d" },
  { icon: Box, title: "Model 3D", href: "/model-3d" },
  { icon: Home, title: "Nội & ngoại thất", href: "/noi-ngoai-that" },
  { icon: Wand2, title: "Motion Graphics", href: "/motion-graphics" },
];

const applications = [
  {
    icon: Palette,
    title: "Thiết kế 2D",
    desc: "Banner quảng cáo, poster sự kiện, key visual chiến dịch, ấn phẩm thương hiệu, infographic và bộ nhận diện hình ảnh.",
  },
  {
    icon: Film,
    title: "Phim trường 3D & Virtual",
    desc: "Talkshow livestream, sự kiện online – hybrid, livestream bán hàng, TV show nội bộ và set ảo cho quảng cáo sản phẩm.",
  },
  {
    icon: Box,
    title: "Model 3D",
    desc: "Mô hình sản phẩm, nhân vật, đạo cụ và prop dựng sẵn cho game, AR/VR, animation và render quảng cáo.",
  },
  {
    icon: Home,
    title: "Nội & Ngoại thất",
    desc: "Render kiến trúc, phối cảnh nội thất, ngoại thất biệt thự – căn hộ và mockup không gian thương mại trước thi công.",
  },
  {
    icon: Wand2,
    title: "Motion Graphics",
    desc: "Video intro/outro, logo reveal, TVC quảng cáo, motion typography và hiệu ứng After Effects cho social media.",
  },
];

const UseCasesSection = () => {
  return (
    <section id="use-cases" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-5" />

      <div className="section-container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Ứng dụng thực tế</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Các nhóm dịch vụ và ứng dụng thực tế trong từng danh mục của DesignHomeKey.
          </p>
        </div>

        {/* Quick category pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {useCases.map((useCase) => (
            <a
              key={useCase.title}
              href={useCase.href}
              className="glass-card px-6 py-4 flex items-center gap-3 card-hover"
            >
              <useCase.icon className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">{useCase.title}</span>
            </a>
          ))}
        </div>

        {/* Applications per category */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {applications.map((app, index) => (
            <div key={index} className="glass-card p-8 card-hover relative">
              <div className="absolute -top-4 -left-2">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <app.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 mt-4 text-foreground">
                {app.title}
              </h3>
              <p className="text-foreground/80 leading-relaxed">{app.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
