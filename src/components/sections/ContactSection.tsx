import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Send, MessageCircle, Phone, Mail, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
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
      `Xin chào! Tôi là ${formData.name}\nSĐT: ${formData.phone}\n${formData.message ? `Nội dung: ${formData.message}` : "Tôi muốn tư vấn về dịch vụ của DesignHomeKey"}`
    );
    
    // Open Zalo chat with pre-filled message
    const zaloUrl = `https://zalo.me/0962968388?text=${zaloMessage}`;
    window.open(zaloUrl, "_blank");
    
    toast({
      title: "Đang chuyển đến Zalo",
      description: "Vui lòng hoàn tất cuộc trò chuyện trên Zalo",
    });
    
    // Reset form
    setFormData({ name: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "Zalo",
      value: "0962 968 388",
      href: "https://zalo.me/0962968388",
    },
    {
      icon: Mail,
      label: "Email",
      value: "designhomekey@gmail.com",
      href: "mailto:designhomekey@gmail.com",
    },
    {
      icon: Facebook,
      label: "Facebook",
      value: "DesignHomeKey",
      href: "https://www.facebook.com/61587057484656",
    },
  ];

  return (
    <section
      id="contact"
      className="py-24 relative overflow-hidden"
      ref={ref}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-glow-secondary/5" />
      <div className="absolute inset-0 grid-pattern opacity-5" />

      {/* Glow Effects */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-glow-secondary/10 rounded-full blur-3xl" />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: 3D Visual / Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Floating 3D Shapes Representation */}
            <div className="relative h-64 lg:h-80">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Glass cube */}
                <motion.div
                  animate={{ rotateY: 360, rotateX: 15 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 glass border border-primary/30 rounded-xl shadow-2xl"
                  style={{ transformStyle: "preserve-3d" }}
                />
                {/* Floating spheres */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-8 right-1/4 w-16 h-16 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 blur-sm"
                />
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-8 left-1/4 w-12 h-12 rounded-full bg-gradient-to-br from-glow-secondary/40 to-glow-secondary/10 blur-sm"
                />
              </div>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 glass rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-8 lg:p-10"
          >
            <h2 className="font-display text-2xl lg:text-3xl font-bold mb-2">
              [ Thảo luận về dự án của bạn ]
            </h2>
            <p className="text-muted-foreground mb-8">
              Để lại thông tin, chúng tôi sẽ liên hệ tư vấn miễn phí qua Zalo
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                  placeholder="Họ và tên *"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                  required
                />
                <Input
                  placeholder="Số điện thoại *"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                  required
                />
                <Textarea
                  placeholder="Mô tả ngắn về dự án (không bắt buộc)"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary resize-none min-h-[80px]"
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="w-full"
                disabled={isSubmitting}
              >
                <MessageCircle className="w-5 h-5" />
                Gửi & Mở Zalo Chat
                <Send className="w-5 h-5" />
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-6 text-center">
              Thông tin của bạn được bảo mật và chỉ dùng để liên hệ tư vấn
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
