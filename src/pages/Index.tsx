import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturedSets from "@/components/sections/FeaturedSets";
import BenefitsSection from "@/components/sections/BenefitsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeaturedSets />
      <BenefitsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
