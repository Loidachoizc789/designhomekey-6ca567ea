import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { name: "Thiết Kế 2D", href: "/thiet-ke-2d" },
  { name: "Phim Trường 3D", href: "/phim-truong-3d" },
  { name: "Model 3D", href: "/model-3d" },
  { name: "Nội Ngoại Thất", href: "/noi-ngoai-that" },
  { name: "After Effects", href: "/after-effects" },
];

const CategoryNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/after-effects") {
      return location.pathname === "/after-effects" || location.pathname === "/motion-graphics";
    }
    return location.pathname === href;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/lovable-uploads/1052d8d6-1118-4206-be15-c73ee5a0188e.png"
              alt="DesignHomeKey"
              className="h-8 md:h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Home Link */}
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              Trang chủ
            </Link>

            {/* Direct category links */}
            {categories.map((category) => (
              <Link
                key={category.href}
                to={category.href}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-full ${
                  isActive(category.href)
                    ? "text-primary-foreground bg-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
              asChild
            >
              <a href="tel:0862098408">Liên hệ ngay</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <div className="px-4 py-6 space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Trang chủ
              </Link>
              
              {categories.map((category) => (
                <Link
                  key={category.href}
                  to={category.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-base font-medium transition-colors ${
                    isActive(category.href)
                      ? "text-primary bg-primary/10 rounded-lg"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category.name}
                </Link>
              ))}

              <div className="pt-4">
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                  asChild
                >
                  <a href="tel:0862098408">Liên hệ ngay</a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default CategoryNavbar;
