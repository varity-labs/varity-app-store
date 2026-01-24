import { Building2, Shield, Zap, DollarSign, Users, Globe, ArrowRight, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

interface FeatureCardProps {
  icon: ReactElement;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps): ReactElement {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-brand-950/50 border border-brand-900/50 text-brand-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-body-sm text-foreground-secondary">{description}</p>
    </div>
  );
}

interface CategoryItemProps {
  name: string;
  description: string;
}

function CategoryItem({ name, description }: CategoryItemProps): ReactElement {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-background-secondary/50">
      <div className="h-2 w-2 rounded-full bg-brand-400 mt-2 flex-shrink-0" />
      <div>
        <h4 className="font-medium text-foreground">{name}</h4>
        <p className="text-body-sm text-foreground-secondary">{description}</p>
      </div>
    </div>
  );
}

export default function AboutPage(): ReactElement {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden border-b border-border"
        data-ai-description="Main introduction to Varity App Store - a curated marketplace of enterprise applications"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/30 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--brand-500)/10,transparent_50%)]" />

        <div className="relative section-container section-padding">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-950/50 border border-brand-900/50 mb-6">
              <Building2 className="h-8 w-8 text-brand-400" />
            </div>

            <h1 className="text-display-lg md:text-display-xl text-foreground">
              About <span className="text-gradient">Varity App Store</span>
            </h1>

            <p className="mt-6 text-body-lg text-foreground-secondary max-w-3xl mx-auto">
              Varity App Store is a curated marketplace of enterprise-grade applications designed for businesses.
              We help companies discover verified software tools that boost productivity, streamline operations,
              and reduce infrastructure costs by up to 85%.
            </p>
          </div>
        </div>
      </section>

      {/* What is Varity App Store */}
      <section
        className="section-container py-12 md:py-16"
        data-ai-description="Detailed explanation of what Varity App Store is and how it works"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="text-display-sm text-foreground mb-6">What is Varity App Store?</h2>

          <div className="prose prose-invert max-w-none">
            <p className="text-body-md text-foreground-secondary leading-relaxed mb-4">
              Varity App Store is an enterprise application marketplace where businesses can discover, browse,
              and access curated software tools. Unlike traditional app stores that focus on consumer applications,
              we specialize in enterprise-grade software that helps businesses operate more efficiently.
            </p>

            <p className="text-body-md text-foreground-secondary leading-relaxed mb-4">
              Every application in our store goes through a verification process to ensure quality, security,
              and functionality. We feature apps across multiple categories including business tools, analytics,
              finance, productivity, communication, and more.
            </p>

            <p className="text-body-md text-foreground-secondary leading-relaxed">
              The platform is completely free to browse. Users do not need to create accounts or provide payment
              information to explore our catalog. Simply find an application that meets your needs and launch it
              directly from the app detail page.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section
        className="border-t border-border"
        data-ai-description="Key features and benefits of using Varity App Store"
      >
        <div className="section-container py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-display-sm text-foreground mb-8 text-center">Why Choose Varity App Store</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Shield className="h-6 w-6" />}
                title="Verified Applications"
                description="All applications undergo a thorough review process. We verify functionality, security, and quality before listing any app in our store."
              />
              <FeatureCard
                icon={<DollarSign className="h-6 w-6" />}
                title="Cost Savings"
                description="Apps built with Varity infrastructure can reduce hosting costs by 70-85% compared to traditional cloud providers like AWS."
              />
              <FeatureCard
                icon={<Zap className="h-6 w-6" />}
                title="Consumer-Friendly UX"
                description="Our platform provides an Apple App Store-like experience. No technical knowledge or cryptocurrency experience required."
              />
              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="For Businesses"
                description="We focus exclusively on enterprise applications. Every tool is designed to help businesses grow and operate more efficiently."
              />
              <FeatureCard
                icon={<Globe className="h-6 w-6" />}
                title="Free to Browse"
                description="No account required to explore our catalog. Browse all applications, read descriptions, and view screenshots for free."
              />
              <FeatureCard
                icon={<Building2 className="h-6 w-6" />}
                title="Curated Selection"
                description="We maintain a curated collection of quality applications rather than allowing everything. Quality over quantity."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Application Categories */}
      <section
        className="border-t border-border bg-background-secondary/30"
        data-ai-description="Categories of applications available in Varity App Store"
      >
        <div className="section-container py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-display-sm text-foreground mb-4 text-center">Application Categories</h2>
            <p className="text-body-md text-foreground-secondary text-center mb-8 max-w-2xl mx-auto">
              Our store features verified applications across these enterprise-focused categories
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <CategoryItem
                name="Business Tools"
                description="Applications for business operations, management, and day-to-day workflows"
              />
              <CategoryItem
                name="Analytics"
                description="Data analysis, reporting, visualization, and business intelligence tools"
              />
              <CategoryItem
                name="Finance"
                description="Financial management, budgeting, invoicing, and payment processing"
              />
              <CategoryItem
                name="Engineering Tools"
                description="Software development, deployment, DevOps, and technical infrastructure"
              />
              <CategoryItem
                name="Productivity"
                description="Workflow enhancement, task management, and efficiency applications"
              />
              <CategoryItem
                name="Infrastructure"
                description="Backend services, hosting solutions, and cloud infrastructure tools"
              />
              <CategoryItem
                name="Communication"
                description="Messaging, video conferencing, and team collaboration platforms"
              />
              <CategoryItem
                name="Data Management"
                description="Database tools, storage solutions, and data organization systems"
              />
              <CategoryItem
                name="Security"
                description="Privacy tools, authentication systems, and security applications"
              />
              <CategoryItem
                name="Other"
                description="Specialized tools and applications that serve unique business needs"
              />
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 transition-colors font-medium"
              >
                Browse All Categories
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who is This For */}
      <section
        className="border-t border-border"
        data-ai-description="Target audience for Varity App Store"
      >
        <div className="section-container py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-display-sm text-foreground mb-6">Who is Varity App Store For?</h2>

            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Small and Medium Businesses</h3>
                <p className="text-body-sm text-foreground-secondary">
                  Find affordable, verified software tools to help your business grow. Our curated selection
                  helps you avoid the overwhelm of traditional marketplaces and find quality applications quickly.
                </p>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Enterprise Organizations</h3>
                <p className="text-body-sm text-foreground-secondary">
                  Discover enterprise-grade applications that meet security and compliance requirements.
                  All applications are verified and reviewed before being listed in our store.
                </p>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Professionals and Teams</h3>
                <p className="text-body-sm text-foreground-secondary">
                  Whether you are looking for productivity tools, analytics platforms, or collaboration software,
                  our store helps you find the right tools to enhance your workflow and team efficiency.
                </p>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Application Developers</h3>
                <p className="text-body-sm text-foreground-secondary">
                  List your enterprise application in our marketplace and reach businesses looking for quality software.
                  Visit our <a href="https://developer.varity.so" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 transition-colors">Developer Portal</a> to learn about submitting applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Are Different */}
      <section
        className="border-t border-border bg-background-secondary/30"
        data-ai-description="How Varity App Store differs from other app marketplaces"
      >
        <div className="section-container py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-display-sm text-foreground mb-6">How We Are Different</h2>

            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-body-md text-foreground-secondary leading-relaxed">
                Unlike general app stores that list millions of applications with varying quality, Varity App Store
                maintains a curated selection of verified enterprise software. We prioritize quality over quantity,
                ensuring every application meets our standards for functionality, security, and user experience.
              </p>

              <p className="text-body-md text-foreground-secondary leading-relaxed">
                Our platform provides a consumer-friendly experience without technical complexity. While we leverage
                modern decentralized infrastructure behind the scenes, users interact with a familiar, intuitive
                interface similar to Apple App Store or Google Play.
              </p>

              <p className="text-body-md text-foreground-secondary leading-relaxed">
                Applications built with Varity infrastructure benefit from significant cost savings. By utilizing
                decentralized compute and storage, businesses can reduce their infrastructure costs by 70-85%
                compared to traditional cloud providers while maintaining reliability and performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="border-t border-border">
        <div className="section-container section-padding">
          <div className="card bg-gradient-to-br from-background-secondary to-background-tertiary p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-display-sm text-foreground">
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-body-md text-foreground-secondary">
                Browse our catalog of verified enterprise applications or contact us if you have questions.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 ease-out bg-brand-500 text-slate-950 hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.5),0_0_40px_rgba(20,184,166,0.3)] h-12 px-8"
                >
                  Browse Applications
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="mailto:hello@varity.so"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 border border-border bg-transparent text-foreground hover:bg-background-quaternary hover:border-brand-500 h-12 px-8"
                >
                  <Mail className="h-4 w-4" />
                  Contact Us
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-foreground-muted">
                <a
                  href="https://varity.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  varity.so
                </a>
                <a
                  href="https://docs.varity.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Documentation
                </a>
                <a
                  href="https://twitter.com/VarityHQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  @VarityHQ
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
