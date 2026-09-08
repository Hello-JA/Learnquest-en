import { Zap, Target, Users, TrendingUp } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Key Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Everything you need to transform learning</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Zap,
              title: "Effective Gamification",
              description: "Points, levels, challenges, and rewards that keep motivation high"
            },
            {
              icon: Target,
              title: "Personalization",
              description: "Content adapted to each student and their learning pace"
            },
            {
              icon: Users,
              title: "Collaboration",
              description: "Teacher, parent, and student working together toward success"
            },
            {
              icon: TrendingUp,
              title: "Progress Tracking",
              description: "Real-time metrics to see progress and adjust strategies"
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="bg-blue-600 text-white rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Gamification Elements Image */}
        <div className="mt-12 md:mt-16">
          <img
            src="/images/gamification.jpg"
            alt="Gamification elements"
            loading="lazy"
            className="w-full max-h-[420px] object-cover rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
