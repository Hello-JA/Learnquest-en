import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question: "How does gamification work in LearnQuest?",
      answer: "LearnQuest uses game elements like points, levels, challenges, and achievements to make learning more motivating. Each correct action earns points, and as students accumulate points, they level up and unlock new challenges."
    },
    {
      question: "What subjects are available?",
      answer: "We currently offer Math, Languages (English, Spanish), Science, and Social Studies. We're constantly expanding our subject catalog."
    },
    {
      question: "Is it safe for children?",
      answer: "Yes, safety is our priority. LearnQuest complies with COPPA and other child privacy regulations. Data is encrypted and we don't share information with third parties."
    },
    {
      question: "Can I see my child's progress?",
      answer: "Absolutely. Parents have access to a dashboard where they can see progress, achievements, time spent, and improvement areas for their children in real-time."
    },
    {
      question: "How much does it cost?",
      answer: "We offer a free plan with limited access and premium plans with more content and features. You can start free without needing a credit card."
    },
    {
      question: "Do I need to be a teacher to use LearnQuest?",
      answer: "No, LearnQuest is designed for students, parents, and teachers. Anyone can sign up and start learning. If you're a teacher, you have access to additional customization tools."
    }
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
        </div>
      </div>
    </section>
  );
}
