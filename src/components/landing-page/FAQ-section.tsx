"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
type FAQItem = {
  question: string;
  answer: string;
};
type FAQSectionProps = {
  title?: string;
  faqs?: FAQItem[];
};
const defaultFAQs: FAQItem[] = [
  {
    question: "What is Ronum and how does it work?",
    answer:
      "It’s a smart PDF workspace where you can upload your PDFs, read them, make notes, and generate instant AI summaries for any page. Everything stays organized in one place.",
  },
  {
    question: "Can I summarize an entire PDF?",
    answer: "Yes. You can summarize individual pages.",
  },
  {
    question: "Who is this app made for",
    answer:
      "Students, researchers, professionals, and anyone who reads long PDFs and wants to understand them faster with clean, organized notes.",
  },
];
export const FAQSection = ({
  title = "Frequently asked questions",
  faqs = defaultFAQs,
}: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <section className="w-full bg-white px-8 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Left Column - Title */}
          <div className="lg:col-span-4">
            <h2
              className="sticky top-24 text-[40px] leading-tight font-normal tracking-tight text-[#202020]"
              style={{
                fontFamily: "var(--font-figtree), Figtree",
                fontWeight: "400",
                fontSize: "40px",
              }}
            >
              {title}
            </h2>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="lg:col-span-8">
            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-[#e5e5e5] last:border-b-0"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="group flex w-full items-center justify-between py-6 text-left transition-opacity duration-150 hover:opacity-70"
                    aria-expanded={openIndex === index}
                  >
                    <span
                      className="pr-8 text-lg leading-7 text-[#202020]"
                      style={{
                        fontFamily: "var(--font-figtree), Figtree",
                        fontWeight: "400",
                      }}
                    >
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{
                        rotate: openIndex === index ? 45 : 0,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="flex-shrink-0"
                    >
                      <Plus
                        className="h-6 w-6 text-[#202020]"
                        strokeWidth={1.5}
                      />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pr-12 pb-6">
                          <p
                            className="text-lg leading-6 text-[#666666]"
                            style={{
                              fontFamily: "var(--font-figtree), Figtree",
                            }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
