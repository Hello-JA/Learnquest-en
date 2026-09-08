export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Designed for Everyone</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Each role has unique benefits on the LearnQuest platform</p>
        </div>

        {/* Collaboration Image */}
        <div className="mb-12">
          <img
            src="/images/collaboration.jpg"
            alt="Collaboration between students, parents, and teachers"
            loading="lazy"
            className="w-full max-h-[420px] object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "For Students",
              benefits: [
                "Fun and motivating learning",
                "Challenges personalized to your level",
                "Clear progression with achievements",
                "Supportive community"
              ],
              icon: "👨‍🎓",
              color: "from-blue-500 to-blue-600"
            },
            {
              title: "For Parents",
              benefits: [
                "Real-time progress tracking",
                "Communication with teachers",
                "Detailed learning reports",
                "Personalized support"
              ],
              icon: "👨‍👩‍👧",
              color: "from-orange-500 to-orange-600"
            },
            {
              title: "For Teachers",
              benefits: [
                "Effective complementary tool",
                "Customizable content",
                "Detailed learning metrics",
                "Time savings on preparation"
              ],
              icon: "👨‍🏫",
              color: "from-green-500 to-green-600"
            }
          ].map((role, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100">
              <div className={`bg-gradient-to-r ${role.color} p-6 text-white`}>
                <div className="text-5xl mb-2">{role.icon}</div>
                <h3 className="text-2xl font-bold">{role.title}</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {role.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-green-500 font-bold mt-1">✓</span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
