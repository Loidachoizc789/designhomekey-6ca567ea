import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import SEOHead from "@/components/SEOHead";
import HeroSection from "@/components/sections/HeroSection";
import BannerSlider from "@/components/sections/BannerSlider";
import Footer from "@/components/sections/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

// Lazy load all non-critical components
const FloatingShapes = lazy(() => import("@/components/FloatingShapes"));
const ScrollToTop = lazy(() => import("@/components/ScrollToTop"));
const AboutSection = lazy(() => import("@/components/sections/AboutSection"));
const CategoriesSection = lazy(() => import("@/components/sections/CategoriesSection"));
const PricingSection = lazy(() => import("@/components/sections/PricingSection"));
const BenefitsSection = lazy(() => import("@/components/sections/BenefitsSection"));
const MidPageCTA = lazy(() => import("@/components/sections/MidPageCTA"));
const UseCasesSection = lazy(() => import("@/components/sections/UseCasesSection"));
const CollaborationSection = lazy(() => import("@/components/sections/CollaborationSection"));
const ContactSection = lazy(() => import("@/components/sections/ContactSection"));

// Minimal placeholder for lazy sections - has fixed min-height for CLS
const SectionFallback = () => (
  <div className="min-h-[200px]" />
);

const Index = () => {
  return (
    <>
      <SEOHead />
      <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
        <Suspense fallback={null}>
          <FloatingShapes />
        </Suspense>
        <Navbar />
        <BannerSlider />
        <HeroSection />
        <Suspense fallback={<SectionFallback />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <CategoriesSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <PricingSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <BenefitsSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <MidPageCTA />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <UseCasesSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <CollaborationSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ContactSection />
        </Suspense>
        <Footer />
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
      </main>
    </>
  );
};

export default Index;
