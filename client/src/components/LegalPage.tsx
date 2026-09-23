import type { ReactNode } from "react";

/**
 * Shared shell for the Privacy Policy and Terms pages, so both sit in the
 * site's visual language instead of reading like a pasted document.
 */
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {title}
            </h1>
            <p className="text-sm text-gray-500">Last updated: {updated}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-10 last:mb-0">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-4 text-gray-700 leading-relaxed [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_ul]:space-y-3 [&_ol]:space-y-3 [&_strong]:text-gray-900">
        {children}
      </div>
    </section>
  );
}
