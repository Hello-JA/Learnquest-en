import { Link } from "wouter";
import { PRELAUNCH_NOTICE } from "@/lib/legal";
import { homeAnchor } from "@/lib/basePath";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
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
            <a href={homeAnchor("features")} className="hover:text-blue-400 transition-colors">
              Features
            </a>
            <Link href="/pricing" className="hover:text-blue-400 transition-colors">
              Pricing
            </Link>
            <a href={homeAnchor("faq")} className="hover:text-blue-400 transition-colors">
              FAQ
            </a>
            <Link href="/privacy" className="hover:text-blue-400 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-blue-400 transition-colors">
              Terms
            </Link>
          </nav>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 space-y-3">
          {/* Pre-launch disclaimer — the site describes planned features. */}
          <p className="text-sm text-gray-400 max-w-3xl">
            <span className="font-semibold text-gray-300">Please note:</span>{" "}
            {PRELAUNCH_NOTICE} Prices shown are indicative and are not an offer to
            sell. The practice demo is an illustration of our teaching approach, not
            an assessment, and it stores no information.
          </p>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} LearnQuest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
