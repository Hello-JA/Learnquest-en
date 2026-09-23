import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onCTAClick: () => void;
}

export default function HeroSection({ onCTAClick }: HeroSectionProps) {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50 py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transform Learning Into a <span className="text-blue-600">Gamified Adventure</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                We help students master challenging subjects through engaging challenges, with support from parents and teachers.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={onCTAClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg"
              >
                Try a Free Challenge
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-96 md:h-full">
            <img
              src="/images/hero-students.jpg"
              alt="Students learning with gamification"
              loading="eager"
              className="w-full h-full object-cover rounded-2xl shadow-xl"
            />
            {/* Floating Badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs border-2 border-orange-500">
              <p className="text-sm font-semibold text-gray-900">🎮 Effective Gamification</p>
              <p className="text-xs text-gray-600">Learn by playing and progress rapidly</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
