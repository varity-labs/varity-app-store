import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="section-container py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo/varity-logo-color.svg"
                alt="Varity"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                Varity
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-body-sm text-foreground-secondary">
              Discover quality applications that work for you. Browse our curated collection of tools and services.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-overline text-foreground-muted">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="https://www.varity.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400"
                >
                  About
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-overline text-foreground-muted">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/help"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@varity.so"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="https://developer.varity.so"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400"
                >
                  Submit Your App
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-caption text-foreground-muted">
            {new Date().getFullYear()} Varity Labs, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
