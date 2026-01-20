"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, X, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { APP_CATEGORIES, SUPPORTED_CHAINS, VALIDATION } from "@/lib/constants";

interface FormData {
  name: string;
  description: string;
  appUrl: string;
  logoUrl: string;
  category: string;
  chainId: number;
  builtWithVarity: boolean;
  githubUrl: string;
  screenshots: string[];
}

const initialFormData: FormData = {
  name: "",
  description: "",
  appUrl: "",
  logoUrl: "",
  category: "",
  chainId: 33529, // Default to Varity Network
  builtWithVarity: true,
  githubUrl: "",
  screenshots: [],
};

export default function SubmitPage() {
  const { authenticated, login } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [screenshotInput, setScreenshotInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addScreenshot = () => {
    if (screenshotInput && formData.screenshots.length < VALIDATION.MAX_SCREENSHOTS) {
      setFormData((prev) => ({
        ...prev,
        screenshots: [...prev.screenshots, screenshotInput],
      }));
      setScreenshotInput("");
    }
  };

  const removeScreenshot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authenticated) {
      login();
      return;
    }

    // Validate form
    if (!formData.name || !formData.description || !formData.appUrl || !formData.category) {
      setErrorMessage("Please fill in all required fields.");
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // TODO: Call smart contract to register app
      // Contract Address: 0x3faa42a8639fcb076160d553e8d6e05add7d97a5
      // const tx = await registryContract.register_app(
      //   formData.name,
      //   formData.description,
      //   formData.appUrl,
      //   formData.logoUrl,
      //   formData.category,
      //   BigInt(formData.chainId),
      //   formData.builtWithVarity,
      //   formData.githubUrl,
      //   formData.screenshots
      // );
      // await tx.wait();

      // Contract integration required - show error for now
      throw new Error("Contract integration not yet implemented. Please check back later.");
    } catch (error) {
      console.error("Submit error:", error);
      const message = error instanceof Error ? error.message : "Failed to submit application. Please try again.";
      setErrorMessage(message);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Back link */}
      <div className="border-b border-slate-800/50">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-100">Submit Application</h1>
          <p className="mt-2 text-sm text-slate-500">
            Submit your application for review. Once approved, it will be listed in the App Store.
          </p>
        </div>

        {/* Success message */}
        {submitStatus === "success" && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-900 bg-emerald-950/50 p-4">
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-400" />
            <div>
              <h3 className="font-medium text-emerald-400">Application Submitted</h3>
              <p className="mt-1 text-sm text-emerald-400/80">
                Your application has been submitted for review. You will be notified once it is approved.
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {submitStatus === "error" && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-900 bg-red-950/50 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
            <div>
              <h3 className="font-medium text-red-400">Submission Failed</h3>
              <p className="mt-1 text-sm text-red-400/80">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Auth gate */}
        {!authenticated ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-8 text-center">
            <h2 className="text-lg font-medium text-slate-200">Sign in required</h2>
            <p className="mt-2 text-sm text-slate-500">
              Please sign in to submit an application.
            </p>
            <button
              onClick={login}
              className="mt-4 rounded-md bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-white"
            >
              Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-200">
                Application Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={VALIDATION.NAME_MAX_LENGTH}
                placeholder="My Application"
                className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-200">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={VALIDATION.DESCRIPTION_MAX_LENGTH}
                rows={5}
                placeholder="Describe your application..."
                className="mt-2 w-full resize-none rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                required
              />
              <p className="mt-1 text-xs text-slate-500">
                {formData.description.length}/{VALIDATION.DESCRIPTION_MAX_LENGTH} characters
              </p>
            </div>

            {/* App URL */}
            <div>
              <label htmlFor="appUrl" className="block text-sm font-medium text-slate-200">
                Application URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                id="appUrl"
                name="appUrl"
                value={formData.appUrl}
                onChange={handleChange}
                placeholder="https://myapp.com"
                className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                required
              />
            </div>

            {/* Logo URL */}
            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-200">
                Logo URL
              </label>
              <input
                type="url"
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
              />
              <p className="mt-1 text-xs text-slate-500">
                Recommended: Square image, minimum 256x256 pixels
              </p>
            </div>

            {/* Category and Network */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-200">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                  required
                >
                  <option value="">Select category</option>
                  {APP_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="chainId" className="block text-sm font-medium text-slate-200">
                  Hosted Network
                </label>
                <select
                  id="chainId"
                  name="chainId"
                  value={formData.chainId}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                >
                  {SUPPORTED_CHAINS.map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* GitHub URL */}
            <div>
              <label htmlFor="githubUrl" className="block text-sm font-medium text-slate-200">
                GitHub Repository
              </label>
              <input
                type="url"
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/username/repo"
                className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
              />
            </div>

            {/* Screenshots */}
            <div>
              <label className="block text-sm font-medium text-slate-200">
                Screenshots ({formData.screenshots.length}/{VALIDATION.MAX_SCREENSHOTS})
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  type="url"
                  value={screenshotInput}
                  onChange={(e) => setScreenshotInput(e.target.value)}
                  placeholder="https://example.com/screenshot.png"
                  className="flex-1 rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                  disabled={formData.screenshots.length >= VALIDATION.MAX_SCREENSHOTS}
                />
                <button
                  type="button"
                  onClick={addScreenshot}
                  disabled={!screenshotInput || formData.screenshots.length >= VALIDATION.MAX_SCREENSHOTS}
                  className="rounded-md border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {formData.screenshots.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {formData.screenshots.map((url, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 rounded border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm"
                    >
                      <span className="flex-1 truncate text-slate-400">{url}</span>
                      <button
                        type="button"
                        onClick={() => removeScreenshot(index)}
                        className="text-slate-500 hover:text-slate-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Built with Varity */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="builtWithVarity"
                name="builtWithVarity"
                checked={formData.builtWithVarity}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-slate-100 focus:ring-slate-600 focus:ring-offset-slate-900"
              />
              <label htmlFor="builtWithVarity" className="text-sm text-slate-300">
                This application was built using Varity SDK
              </label>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 border-t border-slate-800/50 pt-6">
              <Link
                href="/"
                className="rounded-md border border-slate-800 px-5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit for Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
