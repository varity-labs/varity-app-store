"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps): React.JSX.Element {
  const [isRetrying, setIsRetrying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  function handleRetry(): void {
    setIsRetrying(true);
    // Small delay to show loading state
    setTimeout(() => {
      reset();
      setIsRetrying(false);
    }, 500);
  }

  // Determine error type for user-friendly messaging
  const isNetworkError = error.message.toLowerCase().includes("network") ||
    error.message.toLowerCase().includes("fetch");
  const isTimeoutError = error.message.toLowerCase().includes("timeout");

  let errorTitle = "Something Went Wrong";
  let errorDescription = "We encountered an unexpected error. Please try again or return to the homepage.";
  let recoveryHint = "If this problem persists, try clearing your browser cache or contact support.";

  if (isNetworkError) {
    errorTitle = "Connection Error";
    errorDescription = "We couldn't connect to the server. Please check your internet connection.";
    recoveryHint = "Make sure you're connected to the internet, then try again.";
  } else if (isTimeoutError) {
    errorTitle = "Request Timed Out";
    errorDescription = "The server took too long to respond. This might be temporary.";
    recoveryHint = "Wait a moment and try again. The server may be experiencing high traffic.";
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-12">
      {/* Error Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-error/10 border-2 border-error/20 mb-8 animate-scale-in">
        <AlertTriangle className="h-10 w-10 text-error" aria-hidden="true" />
      </div>

      {/* Error Message */}
      <h1 className="text-display-sm text-foreground mb-3">{errorTitle}</h1>
      <p className="text-body-lg text-foreground-secondary mb-4 max-w-lg">
        {errorDescription}
      </p>
      <p className="text-body-sm text-foreground-muted mb-8 max-w-md">
        {recoveryHint}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-slate-950 rounded-lg font-semibold hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.5)] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} aria-hidden="true" />
          {isRetrying ? "Retrying..." : "Try Again"}
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-medium text-foreground hover:bg-background-quaternary hover:border-brand-500 transition-all duration-200"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Go Home
        </Link>
      </div>

      {/* Error Details (collapsible) */}
      {(error.digest || error.message) && (
        <div className="w-full max-w-lg">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-2 text-body-sm text-foreground-muted hover:text-foreground-secondary transition-colors"
            aria-expanded={showDetails}
          >
            {showDetails ? (
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            )}
            {showDetails ? "Hide technical details" : "Show technical details"}
          </button>

          {showDetails && (
            <div className="mt-4 p-4 bg-background-secondary rounded-lg border border-border text-left animate-fade-in">
              {error.digest && (
                <p className="text-body-sm text-foreground-muted mb-2">
                  <span className="font-medium text-foreground-secondary">Error ID:</span>{" "}
                  <code className="font-mono text-xs bg-background-tertiary px-1.5 py-0.5 rounded">
                    {error.digest}
                  </code>
                </p>
              )}
              <p className="text-body-sm text-foreground-muted">
                <span className="font-medium text-foreground-secondary">Message:</span>{" "}
                <code className="font-mono text-xs break-all">{error.message}</code>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
