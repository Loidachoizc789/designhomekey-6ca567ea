import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const MidPageCTA = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-glow-secondary/10" />
      <div className="section-container relative z-10 text-center max-w-3xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
          Bắt đầu dự án của bạn{" "}
          <span className="gradient-text">ngay hôm nay</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Nhận tư vấn miễn phí từ đội ngũ chuyên gia – hoặc khám phá toàn bộ thư viện asset 3D & 2D của chúng tôi.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="xl" asChild>
            <a href="#contact">
              <MessageCircle className="w-5 h-5" />
              Nhận tư vấn miễn phí
            </a>
          </Button>
          <Button variant="hero-outline" size="xl" asChild>
            <a href="#categories">
              Bắt đầu dự án thiết kế
              <ArrowRight className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MidPageCTA;
