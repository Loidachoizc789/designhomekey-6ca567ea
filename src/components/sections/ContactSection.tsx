import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Send, MessageCircle, Phone, Mail, Facebook, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Floating shapes for contact section
const FloatingContactShapes = () => {
  const shapes = [
    // Left side
    { x: "5%", y: "10%", size: "w-16 h-24", color: "primary", delay: 0 },
    { x: "8%", y: "35%", size: "w-20 h-28", color: "glow-secondary", delay: 0.3 },
    { x: "3%", y: "60%", size: "w-14 h-20", color: "primary", delay: 0.6 },
    { x: "10%", y: "80%", size: "w-18 h-26", color: "glow-secondary", delay: 0.9 },
    
    // Left-center
    { x: "20%", y: "25%", size: "w-12 h-18", color: "primary", delay: 0.2 },
    { x: "25%", y: "50%", size: "w-16 h-22", color: "glow-secondary", delay: 0.5 },
    { x: "18%", y: "70%", size: "w-14 h-20", color: "primary", delay: 0.8 },
    
    // Right-center  
    { x: "75%", y: "20%", size: "w-14 h-20", color: "glow-secondary", delay: 0.15 },
    { x: "78%", y: "45%", size: "w-18 h-26", color: "primary", delay: 0.45 },
    { x: "72%", y: "75%", size: "w-16 h-22", color: "glow-secondary", delay: 0.75 },
    
    // Right side
    { x: "90%", y: "15%", size: "w-18 h-26", color: "primary", delay: 0.1 },
    { x: "88%", y: "40%", size: "w-14 h-20", color: "glow-secondary", delay: 0.4 },
    { x: "92%", y: "65%", size: "w-20 h-28", color: "primary", delay: 0.7 },
    { x: "85%", y: "85%", size: "w-16 h-24", color: "glow-secondary", delay: 1 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.size} rounded-2xl`}
          style={{
            left: shape.x,
            top: shape.y,
            background: shape.color === "primary" 
              ? `linear-gradient(135deg, hsl(var(--primary) / 0.12) 0%, hsl(var(--primary) / 0.04) 100%)`
              : `linear-gradient(135deg, hsl(var(--glow-secondary) / 0.12) 0%, hsl(var(--glow-secondary) / 0.04) 100%)`,
            backdropFilter: "blur(6px)",
            border: `1px solid ${shape.color === "primary" ? "hsl(var(--primary) / 0.15)" : "hsl(var(--glow-secondary) / 0.15)"}`,
          }}
          animate={{ 
            y: [0, -12, 0],
          }}
          transition={{
            duration: 4 + index * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay
          }}
        />
      ))}
    </div>
  );
};

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (formData.name.trim().length < 2) {
      toast({
        title: "Lỗi",
        description: "Họ tên phải có ít nhất 2 ký tự",
        variant: "destructive",
      });
      return false;
    }
    
    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      toast({
        title: "Lỗi",
        description: "Số điện thoại phải có 9-11 số",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Construct Zalo message with customer info
    const zaloMessage = encodeURIComponent(
      `Xin chào! Tôi là ${formData.name}\nSĐT: ${formData.phone}\nTôi muốn tư vấn về dịch vụ của DesignHomeKey`
    );
    
    // Open Zalo chat with pre-filled message
    const zaloUrl = `https://zalo.me/0962968388?text=${zaloMessage}`;
    window.open(zaloUrl, "_blank");
    
    toast({
      title: "Đang chuyển đến Zalo",
      description: "Vui lòng hoàn tất cuộc trò chuyện trên Zalo",
    });
    
    // Reset form
    setFormData({ name: "", phone: "" });
    setIsSubmitting(false);
  };

  return (
    <section
      id="contact"
      className="py-24 relative overflow-hidden"
      ref={ref}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/50" />
      
      {/* Floating shapes on both sides */}
      <FloatingContactShapes />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Collaboration Card */}
            <div className="glass-card p-6 max-w-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg">Mở rộng cộng đồng</h3>
                  <p className="text-sm text-muted-foreground">Designer, artist, creator ở mọi nơi</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                asChild
              >
                <a href="mailto:designhomekey@gmail.com">
                  Liên hệ hợp tác →
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-lg ml-auto"
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-3">
              <span className="text-primary">[</span>
              Thảo luận về
              <br />
              dự án của bạn
              <span className="text-primary">]</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Điền thông tin và chúng tôi sẽ liên hệ lại sớm nhất
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                placeholder="Tên của bạn"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-transparent border-0 border-b border-border/50 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary h-12 text-lg"
                required
              />
              <Input
                placeholder="Số điện thoại"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="bg-transparent border-0 border-b border-border/50 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary h-12 text-lg"
                required
              />

              <Button
                type="submit"
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8"
                disabled={isSubmitting}
              >
                <Send className="w-5 h-5 mr-2" />
                GỬI
              </Button>

              <p className="text-xs text-muted-foreground">
                Bằng việc gửi thông tin, bạn đồng ý với{" "}
                <a href="#" className="text-primary hover:underline">chính sách bảo mật</a>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
