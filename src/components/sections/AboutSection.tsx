import { Box, Palette, Layers, Repeat, Settings, Cpu } from "lucide-react";

const features = [{
  icon: Box,
  title: "Phim trường 3D",
  description: "Talkshow, livestream, TV show, event – sẵn sàng render realtime"
}, {
  icon: Layers,
  title: "Model 3D",
  description: "Props, background, modular set – tối ưu UE5 & Blender"
}, {
  icon: Palette,
  title: "Thiết kế 2D",
  description: "Visual, backdrop, layout – đồng bộ với set 3D"
}, {
  icon: Repeat,
  title: "Tái sử dụng linh hoạt",
  description: "Một asset dùng cho nhiều dự án, nhiều khách hàng"
}, {
  icon: Settings,
  title: "Dễ tùy chỉnh",
  description: "Thay đổi theo brand, concept, ngân sách"
}, {
  icon: Cpu,
  title: "Tối ưu realtime",
  description: "Unreal Engine 5, Aximmetry, render – livestream – event"
}];

const AboutSection = () => {
  return (
    <section id="about" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="section-container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6 md:text-6xl">
            Chúng tôi đang xây dựng{" "}
            <span className="gradient-text">điều gì?</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Chúng tôi xây dựng một tập hợp các thiết kế nhỏ gồm phim trường 3D, model 3D và thiết kế 2D – 
            tất cả đều hướng tới mục tiêu: ráp nhanh thành dự án lớn, tái sử dụng cho nhiều khách hàng, 
            linh hoạt chỉnh sửa theo brand, concept, ngân sách.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="glass-card p-6 card-hover group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
