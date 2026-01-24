"use client";

import * as React from "react";
import { useState, useCallback, memo } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Search, Grid3x3, ExternalLink, Mail } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { StructuredData, createHelpPageSchema, helpPageFAQData } from "@/components/StructuredData";

interface FAQItem {
  question: string;
  answer: string | ReactNode;
}

interface FAQSection {
  title: string;
  icon: ReactNode;
  items: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    title: "Getting Started",
    icon: <HelpCircle className="h-5 w-5" />,
    items: [
      {
        question: "What is the Varity App Store?",
        answer: "The Varity App Store is a curated marketplace of enterprise-grade applications. We feature quality tools and services that help businesses operate more efficiently while reducing infrastructure costs by up to 85%.",
      },
      {
        question: "Is it free to browse?",
        answer: "Yes, browsing the Varity App Store is completely free. You can explore all available applications, view details, and access them directly at no cost.",
      },
      {
        question: "Do I need an account to use applications?",
        answer: "No account is required to browse or access applications in the store. Each application has its own access requirements, which are specified on the application's detail page.",
      },
      {
        question: "How do applications work?",
        answer: "Each application in our store is a fully functional web service. Simply click on an application card to view details, then click 'Open Application' to launch it in a new tab.",
      },
    ],
  },
  {
    title: "Finding Apps",
    icon: <Search className="h-5 w-5" />,
    items: [
      {
        question: "How do I find apps?",
        answer: (
          <>
            There are several ways to discover applications:
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>Use the search bar on the homepage to search by name or description</li>
              <li>Browse by category using the category filters</li>
              <li>Visit the <Link href="/categories" className="text-brand-400 hover:text-brand-300 transition-colors">Categories page</Link> to see all available categories</li>
              <li>Filter by platform using the platform filter dropdown</li>
            </ul>
          </>
        ),
      },
      {
        question: "What do the categories mean?",
        answer: (
          <>
            Our categories help you find the right tool for your needs:
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li><strong>Business Tools:</strong> Applications for business operations and management</li>
              <li><strong>Analytics:</strong> Data analysis and reporting tools</li>
              <li><strong>Finance:</strong> Financial management and payment applications</li>
              <li><strong>Developer Tools:</strong> Tools for software development and deployment</li>
              <li><strong>Productivity:</strong> Apps to enhance workflow and efficiency</li>
              <li><strong>Infrastructure:</strong> Backend services and hosting solutions</li>
              <li><strong>Communication:</strong> Messaging and collaboration platforms</li>
              <li><strong>Data Management:</strong> Database and storage solutions</li>
              <li><strong>Security:</strong> Privacy and security applications</li>
            </ul>
          </>
        ),
      },
      {
        question: "What does the 'Verified' badge mean?",
        answer: "The 'Verified' badge indicates that an application was built using Varity infrastructure. These applications benefit from enhanced performance, lower costs, and have been verified by our team.",
      },
    ],
  },
  {
    title: "Using Apps",
    icon: <Grid3x3 className="h-5 w-5" />,
    items: [
      {
        question: "How do I open an application?",
        answer: "Click on any application card to view its detail page. On the detail page, you'll find an 'Open Application' button that launches the app in a new browser tab.",
      },
      {
        question: "Are these applications safe to use?",
        answer: "All applications in the Varity App Store go through a review process before being approved. We verify that applications meet our quality standards and function as described. However, as with any web service, we recommend reviewing each application's details before use.",
      },
      {
        question: "Can I view the source code?",
        answer: "Many applications in our store are open source. If an application has a 'View Source' button on its detail page, you can click it to view the source code on GitHub.",
      },
      {
        question: "What platforms are supported?",
        answer: "Applications in our store run on multiple platforms including Varity, Arbitrum, Ethereum, Polygon, Optimism, and Base. You can filter applications by platform using the platform filter on the browse page.",
      },
    ],
  },
  {
    title: "For Developers",
    icon: <ExternalLink className="h-5 w-5" />,
    items: [
      {
        question: "How do I submit my app?",
        answer: (
          <>
            We welcome quality applications to our marketplace! To submit your app, visit our{" "}
            <a
              href="https://developer.varity.so"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 hover:text-brand-300 transition-colors"
            >
              Developer Portal
            </a>{" "}
            where you'll find submission guidelines and the application form.
          </>
        ),
      },
      {
        question: "What are the requirements for submitting an app?",
        answer: (
          <>
            To be considered for the Varity App Store, your application should:
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>Be fully functional and production-ready</li>
              <li>Provide clear value to users</li>
              <li>Have a professional appearance and user experience</li>
              <li>Include accurate description and screenshots</li>
              <li>Comply with our terms of service and community guidelines</li>
            </ul>
          </>
        ),
      },
      {
        question: "How long does the review process take?",
        answer: "We typically review submitted applications within 3-5 business days. You'll receive notification once your application has been reviewed, whether approved or if changes are needed.",
      },
      {
        question: "Can I update my app after it's approved?",
        answer: "Yes, developers can update their application's description, URL, and screenshots at any time. Simply sign in with the same account you used to submit the app and access your developer dashboard.",
      },
    ],
  },
];

function FAQAccordionComponent({ section }: { section: FAQSection }): React.JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex(prev => prev === index ? null : index);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-brand-950/50 border border-brand-900/50 text-brand-400">
          {section.icon}
        </div>
        <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
      </div>

      <div className="space-y-3">
        {section.items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="card overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => handleToggle(index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-background-secondary transition-colors"
                aria-expanded={isOpen}
              >
                <h3 className="text-body-md font-medium text-foreground pr-4">
                  {item.question}
                </h3>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-brand-400 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-foreground-muted flex-shrink-0" aria-hidden="true" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-0">
                  <div className="text-body-sm text-foreground-secondary leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const FAQAccordion = memo(FAQAccordionComponent);

export default function HelpPage(): React.JSX.Element {
  const helpPageSchema = createHelpPageSchema(helpPageFAQData);

  return (
    <>
      {/* Help page schema with FAQ and breadcrumb for Google Rich Snippets */}
      <StructuredData data={helpPageSchema} id="help-page-schema" />

      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/30 via-background to-background" />

        <div className="relative section-container section-padding">
          <div className="mx-auto max-w-3xl text-center">
            {/* Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-950/50 border border-brand-900/50 mb-6">
              <HelpCircle className="h-8 w-8 text-brand-400" />
            </div>

            <h1 className="text-display-lg md:text-display-xl text-foreground">
              How Can We <span className="text-gradient">Help You?</span>
            </h1>

            <p className="mt-6 text-body-lg text-foreground-secondary max-w-2xl mx-auto">
              Find answers to common questions about using the Varity App Store, discovering applications, and submitting your own.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="section-container py-12 md:py-16">
        <div className="mx-auto max-w-3xl space-y-12">
          {faqSections.map((section, index) => (
            <FAQAccordion key={index} section={section} />
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="border-t border-border">
        <div className="section-container section-padding">
          <div className="card bg-gradient-to-br from-background-secondary to-background-tertiary p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-950/50 border border-brand-900/50 mb-6">
                <Mail className="h-6 w-6 text-brand-400" />
              </div>

              <h2 className="text-display-sm text-foreground">
                Still Have Questions?
              </h2>
              <p className="mt-4 text-body-md text-foreground-secondary">
                Can't find what you're looking for? Our team is here to help. Reach out and we'll get back to you as soon as possible.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a
                  href="mailto:hello@varity.so"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 ease-out bg-brand-500 text-slate-950 hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.5),0_0_40px_rgba(20,184,166,0.3)] h-12 px-8"
                >
                  <Mail className="h-4 w-4" />
                  Contact Support
                </a>
                <a
                  href="https://docs.varity.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 border border-border bg-transparent text-foreground hover:bg-background-quaternary hover:border-brand-500 h-12 px-8"
                >
                  View Documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
