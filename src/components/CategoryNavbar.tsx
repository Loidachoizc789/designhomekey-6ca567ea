import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { name: "Thiết Kế 2D", href: "/thiet-ke-2d" },
  { name: "Thiết Kế 3D", href: "/phim-truong-3d" },
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
          : "bg-background/50 backdrop-blur-xl border-b border-border/50"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo - Larger and pushed to left edge */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src="/lovable-uploads/1052d8d6-1118-4206-be15-c73ee5a0188e.png"
              alt="DesignHomeKey"
              className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto"
            />
          </Link>

          {/* Desktop Navigation - Centered with larger text */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Home Link */}
            <Link
              to="/"
              className="text-base lg:text-lg font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              Trang chủ
            </Link>

            {/* Direct category links */}
            {categories.map((category) => (
              <Link
                key={category.href}
                to={category.href}
                className={`text-base lg:text-lg font-medium transition-colors whitespace-nowrap px-5 py-2.5 rounded-full ${
                  isActive(category.href)
                    ? "text-primary-foreground bg-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* CTA Button - Pushed to right edge */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            <Button
              size="lg"
              className="relative bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 py-6 text-lg font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300 animate-pulse-glow"
              asChild
            >
              <a href="https://www.facebook.com/61587057484656" target="_blank" rel="noopener noreferrer">
                Liên hệ ngay
              </a>
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
                className="block px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Trang chủ
              </Link>
              
              {categories.map((category) => (
                <Link
                  key={category.href}
                  to={category.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-lg font-medium transition-colors ${
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
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-base py-5 font-semibold shadow-lg shadow-primary/30"
                  asChild
                >
                  <a href="https://www.facebook.com/61587057484656" target="_blank" rel="noopener noreferrer">
                    Liên hệ ngay
                  </a>
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
