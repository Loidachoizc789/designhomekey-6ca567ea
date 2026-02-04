import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#about", label: "Giới thiệu" },
  { href: "#categories", label: "Danh mục" },
  { href: "#pricing", label: "Bảng giá" },
  { href: "#benefits", label: "Lợi ích" },
  { href: "#use-cases", label: "Ứng dụng" },
  { href: "#collaboration", label: "Hợp tác" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl border-b ${
          isScrolled 
            ? "bg-background/80 border-border" 
            : "bg-background/50 border-border/50"
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - Larger and left aligned */}
            <a href="#" className="flex items-center">
              <img
                alt="DesignHomeKey"
                className="h-8 md:h-10 w-auto"
                src="/lovable-uploads/1052d8d6-1118-4206-be15-c73ee5a0188e.png"
              />
            </a>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors animated-underline"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA - Right aligned */}
            <div className="hidden lg:flex items-center">
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-5 text-base font-medium"
                asChild
              >
                <a href="#contact">Liên hệ</a>
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
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border lg:hidden"
          >
            <div className="section-container py-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-4 border-t border-border">
                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-base py-5"
                    asChild
                  >
                    <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>
                      Liên hệ
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
