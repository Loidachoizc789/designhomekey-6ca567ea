import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import UseCasesSection from "@/components/sections/UseCasesSection";
import CollaborationSection from "@/components/sections/CollaborationSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <CategoriesSection />
      <BenefitsSection />
      <UseCasesSection />
      <CollaborationSection />
      <CTASection />
      <Footer />
      <ScrollToTop />
    </main>
  );
};

export default Index;
