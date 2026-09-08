import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { trpc } from '@/lib/trpc';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    description: 'Perfect for getting started',
    highlighted: false,
    ctaText: 'Get Started',
    features: [
      'Basic learning challenges',
      'Limited practice problems',
      'Community support',
      'Progress tracking',
    ],
  },
  {
    name: 'Pro',
    price: '$7.99',
    period: '/month',
    description: 'For serious learners',
    badge: 'Most Popular',
    highlighted: true,
    ctaText: 'Upgrade to Pro',
    features: [
      'All Free features',
      'Unlimited challenges',
      'Advanced analytics',
      'Priority support',
      'Custom learning paths',
      'Offline access',
    ],
  },
  {
    name: 'Enterprise',
    price: '$20.99',
    period: '/month',
    description: 'For schools and organizations',
    highlighted: false,
    ctaText: 'Contact Sales',
    features: [
      'All Pro features',
      'Team management',
      'Advanced reporting',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'White-label options',
    ],
  },
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinWaitlist = trpc.registrations.waitlist.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelectedPlan(null);
        setEmail('');
      }, 2500);
    },
    onError: (err) => {
      setError(err.message || 'Something went wrong. Please try again.');
    },
  });

  const closeModal = () => {
    setSelectedPlan(null);
    setEmail('');
    setError(null);
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedPlan) return;

    setError(null);
    joinWaitlist.mutate({ email, plan: selectedPlan });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto px-4">
            {/* Heading — matches the section headings used across the site */}
            <div className="text-center mb-12 md:mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose the perfect plan for your learning journey. Every plan includes full
                access to our gamified learning platform.
              </p>
            </div>

            {/* Pricing Cards Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl p-8 flex flex-col shadow-lg transition-transform duration-200 hover:-translate-y-1 ${
                    plan.highlighted
                      ? 'bg-blue-600 text-white ring-4 ring-blue-600/40'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow">
                      {plan.badge}
                    </span>
                  )}

                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className={`mt-2 text-sm ${plan.highlighted ? 'text-blue-100' : 'text-gray-500'}`}>
                    {plan.description}
                  </p>
                  <div className="mt-6 flex items-baseline">
                    <span className="text-5xl font-extrabold">{plan.price}</span>
                    <span className={`ml-1 text-base ${plan.highlighted ? 'text-blue-200' : 'text-gray-500'}`}>
                      {plan.period}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setError(null);
                      setSubmitted(false);
                      setSelectedPlan(plan.name);
                    }}
                    className={`mt-8 w-full py-3 px-6 rounded-lg font-semibold shadow transition-all hover:shadow-lg ${
                      plan.highlighted
                        ? 'bg-white text-blue-600 hover:bg-blue-50'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {plan.ctaText}
                  </button>

                  <div className="mt-8">
                    <p className={`text-xs font-semibold uppercase tracking-wider ${plan.highlighted ? 'text-blue-200' : 'text-gray-500'}`}>
                      Includes:
                    </p>
                    <ul className="mt-4 space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <svg
                            className={`h-5 w-5 mr-3 shrink-0 ${plan.highlighted ? 'text-white' : 'text-blue-600'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className={plan.highlighted ? '' : 'text-gray-700'}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-gray-500 mt-12">
              Prices in USD. No credit card required to start.
            </p>
          </div>
        </section>
      </main>

      <Footer />

      {/* Waitlist Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <h3 className="text-2xl font-bold text-gray-900">You're on the list! 🎉</h3>
                <p className="mt-2 text-gray-600">We'll notify you as soon as {selectedPlan} is ready.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-2xl font-bold text-gray-900">Coming Soon!</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Our team is working hard to finish this product. Enter your email and we'll notify you as soon as it's ready.
                </p>
                <p className="mt-4 text-sm font-semibold text-gray-800">
                  Selected Plan: <span className="text-blue-600">{selectedPlan}</span>
                </p>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                  />
                </div>

                {error && (
                  <p className="mt-3 text-sm text-red-600">{error}</p>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-1/2 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={joinWaitlist.isPending}
                    className="w-1/2 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow transition disabled:opacity-50"
                  >
                    {joinWaitlist.isPending ? 'Submitting…' : 'Notify Me'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
