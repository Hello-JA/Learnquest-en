import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import BenefitsSection from "@/components/BenefitsSection";
import FeaturesSection from "@/components/FeaturesSection";
import FAQSection from "@/components/FAQSection";
import RegisterSection from "@/components/RegisterSection";
import Footer from "@/components/Footer";

export default function Home() {
  const scrollToRegister = () => {
    const element = document.getElementById("register");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <HeroSection onCTAClick={scrollToRegister} />
        <HowItWorksSection />
        <BenefitsSection />
        <FeaturesSection />
        <FAQSection />
        <RegisterSection />
      </main>
      <Footer />
    </div>
  );
}
