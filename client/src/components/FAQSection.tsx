import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";

export default function FAQSection() {
  // NOTE: LearnQuest is pre-launch. Answers here describe what exists today
  // versus what is planned — avoid present-tense claims about unbuilt
  // features, and never assert a compliance status we have not implemented.
  const faqs = [
    {
      question: "How does gamification work in LearnQuest?",
      answer:
        "LearnQuest is built around game elements like points, levels, challenges and streaks. Crucially, points are earned for understanding rather than guessing: every answer is followed by the reasoning behind it, and hints point to a strategy without giving the answer away. You can try this for yourself in our free demo.",
    },
    {
      question: "What subjects will be available?",
      answer:
        "LearnQuest is still in development. The demo available today covers multiplication. At launch we plan to cover Math, Languages (English and Spanish), Science and Social Studies, and to expand from there. Subjects are not final and may change.",
    },
    {
      question: "Is it safe for children?",
      answer:
        "Today, the demo is the safest part of the site: it runs entirely in your browser, requires no sign-up, and stores and transmits nothing. We are not yet operating a service that collects information from children. The waitlist is intended for adults, and we do not knowingly collect personal information from anyone under 13. Before we launch anything children use directly, we will put verifiable parental consent and our other COPPA obligations in place. Our Privacy Policy sets out exactly what we collect today.",
    },
    {
      question: "Will I be able to see my child's progress?",
      answer:
        "That is the plan. We intend to give parents a dashboard showing progress, achievements, time spent and areas needing work. This is not built yet, and nothing described here is available today.",
    },
    {
      question: "How much will it cost?",
      answer:
        "We intend to offer a free plan alongside paid plans with more content and features. The prices shown on our pricing page are indicative only, are not an offer to sell, and may change before launch. Nothing is for sale yet and we are not accepting payment.",
    },
    {
      question: "Do I need to be a teacher to use LearnQuest?",
      answer:
        "No. LearnQuest is being designed for students, parents and teachers alike, with extra customization tools planned for teachers. Sign-ups are not open yet, but you can try the demo now and join the waitlist to hear when we launch.",
    },
  ];

  return (
    <section id="faq" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">We answer your questions about LearnQuest</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="bg-white border border-gray-200 rounded-lg px-6 data-[state=open]:shadow-md transition-shadow">
                <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:text-blue-600 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-center text-sm text-gray-500 mt-8">
            LearnQuest is in development and not yet available for purchase. See our{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
