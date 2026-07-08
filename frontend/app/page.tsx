import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import AudienceSplit from "@/components/landing/AudienceSplit";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import Starfield from "@/components/ui-custom/Starfield";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#111827] text-white">
      <div className="fixed inset-0">
        <Starfield density="normal" />
      </div>

      <div className="relative">
        <Navbar />
        <Hero />
        <HowItWorks />
        <AudienceSplit />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </div>
  );
}
