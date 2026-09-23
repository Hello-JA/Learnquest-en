import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LQ</span>
              </div>
              <span className="font-bold text-white">LearnQuest</span>
            </div>
            <p className="text-sm text-gray-400">
              Transforming education through gamification.
            </p>
          </div>

          {/* Quick links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <Link href="/demo" className="hover:text-blue-400 transition-colors">
              Try Demo
            </Link>
            <a href="/#features" className="hover:text-blue-400 transition-colors">
              Features
            </a>
            <Link href="/pricing" className="hover:text-blue-400 transition-colors">
              Pricing
            </Link>
            <a href="/#faq" className="hover:text-blue-400 transition-colors">
              FAQ
            </a>
            <Link href="/pricing" className="hover:text-blue-400 transition-colors">
              Get Started
            </Link>
          </nav>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} LearnQuest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
