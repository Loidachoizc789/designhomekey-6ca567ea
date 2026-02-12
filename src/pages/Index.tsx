import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import SEOHead from "@/components/SEOHead";
import HeroSection from "@/components/sections/HeroSection";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/sections/Footer";

// Lazy load below-the-fold sections to reduce initial bundle & TBT
const AboutSection = lazy(() => import("@/components/sections/AboutSection"));
const CategoriesSection = lazy(() => import("@/components/sections/CategoriesSection"));
const PricingSection = lazy(() => import("@/components/sections/PricingSection"));
const BenefitsSection = lazy(() => import("@/components/sections/BenefitsSection"));
const UseCasesSection = lazy(() => import("@/components/sections/UseCasesSection"));
const CollaborationSection = lazy(() => import("@/components/sections/CollaborationSection"));
const ContactSection = lazy(() => import("@/components/sections/ContactSection"));

// Minimal placeholder for lazy sections
const SectionFallback = () => (
  <div className="min-h-[200px]" />
);

const Index = () => {
  return (
    <>
      <SEOHead />
      <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Navbar />
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
          <UseCasesSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <CollaborationSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ContactSection />
        </Suspense>
        <Footer />
        <ScrollToTop />
      </main>
    </>
  );
};

export default Index;
