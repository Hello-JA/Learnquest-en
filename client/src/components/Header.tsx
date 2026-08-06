import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">LQ</span>
          </div>
          <span className="font-bold text-xl text-gray-900 hidden sm:inline">LearnQuest</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("hero")}
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection("benefits")}
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            Benefits
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            FAQ
          </button>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button
            onClick={() => scrollToSection("register")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all hover:shadow-lg"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-900" />
          ) : (
            <Menu className="w-6 h-6 text-gray-900" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-3">
          <button
            onClick={() => scrollToSection("hero")}
            className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 font-medium"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 font-medium"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection("benefits")}
            className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 font-medium"
          >
            Benefits
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="block w-full text-left text-gray-700 hover:text-blue-600 py-2 font-medium"
          >
            FAQ
          </button>
          <Button
            onClick={() => scrollToSection("register")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-2"
          >
            Get Started
          </Button>
        </div>
      )}
    </header>
  );
}
