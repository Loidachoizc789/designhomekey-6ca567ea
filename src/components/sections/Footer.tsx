import { 
  Facebook, 
  Youtube, 
  Instagram, 
  Mail, 
  Phone, 
  MessageCircle
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-card border-t border-border">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold gradient-text mb-4">
              DesignHomeKey
            </h3>
            <p className="text-muted-foreground mb-6">
              Hệ sinh thái Phim trường 3D, Thiết kế 2D & Model 3D cho 
              livestream, TV show, sự kiện và quảng cáo.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Liên kết nhanh</h4>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-muted-foreground hover:text-primary transition-colors animated-underline">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#categories" className="text-muted-foreground hover:text-primary transition-colors animated-underline">
                  Danh mục sản phẩm
                </a>
              </li>
              <li>
                <a href="#benefits" className="text-muted-foreground hover:text-primary transition-colors animated-underline">
                  Lợi ích
                </a>
              </li>
              <li>
                <a href="#collaboration" className="text-muted-foreground hover:text-primary transition-colors animated-underline">
                  Hợp tác
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:loizc84@gmail.com" className="hover:text-primary transition-colors">
                  loizc84@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:0862098408" className="hover:text-primary transition-colors">
                  0862 098 408
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <MessageCircle className="w-5 h-5 text-primary" />
                <a href="https://zalo.me/0862098408" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Zalo: 0862 098 408
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Chính sách</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors animated-underline">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors animated-underline">
                  Chính sách bản quyền asset
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors animated-underline">
                  Hướng dẫn sử dụng phim trường 3D
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors animated-underline">
                  Ghi chú phân phối & hợp tác
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} DesignHomeKey. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by <span className="text-primary">Unreal Engine 5</span> & <span className="text-primary">Blender</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
