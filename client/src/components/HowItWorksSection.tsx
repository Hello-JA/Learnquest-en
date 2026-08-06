export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Your Learning Journey</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover how LearnQuest transforms your learning in 4 simple steps</p>
        </div>

        {/* How It Works Image */}
        <div className="mb-12">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663583729031/XDDRwnHgGWQp3VXWLqVt2K/how-it-works-journey-eC4yvaZxAXsyHbMTScYpYq.webp"
            alt="How LearnQuest works"
            className="w-full rounded-2xl shadow-lg"
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "1",
              title: "Choose Your Subject",
              description: "Select the subject you want to master. Math, languages, science, and more.",
              icon: "📚"
            },
            {
              step: "2",
              title: "Get Personalized Challenges",
              description: "Receive challenges tailored to your level. Easy, medium, or hard. You decide.",
              icon: "🎮"
            },
            {
              step: "3",
              title: "Progress & Unlock",
              description: "Complete challenges, earn points, unlock achievements, and level up.",
              icon: "⭐"
            },
            {
              step: "4",
              title: "Achieve Mastery",
              description: "Celebrate your success. You've transformed a difficult subject into your strength.",
              icon: "🏆"
            }
          ].map((item) => (
            <div key={item.step} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">{item.icon}</div>
              <div className="inline-block bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-700 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
