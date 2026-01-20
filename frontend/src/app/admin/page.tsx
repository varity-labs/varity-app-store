"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/Badge";
import { Check, X, Star, ExternalLink, AlertTriangle } from "lucide-react";
import type { AppData } from "@/lib/constants";

// TODO: Fetch admin addresses from contract owner or admin mapping
// Contract Address: 0x3faa42a8639fcb076160d553e8d6e05add7d97a5
const ADMIN_ADDRESSES: string[] = [];

export default function AdminPage() {
  const { authenticated, login, user } = useAuth();
  // TODO: Fetch pending apps from contract (apps where isApproved = false)
  const [pendingApps, setPendingApps] = useState<AppData[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  // Check if user is admin
  const isAdmin = user?.wallet?.address
    ? ADMIN_ADDRESSES.includes(user.wallet.address.toLowerCase())
    : false;

  if (!authenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h1 className="text-xl font-semibold text-slate-100">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in with an admin account to access this page.</p>
        <button
          onClick={login}
          className="mt-4 rounded-md bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-white"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <AlertTriangle className="h-12 w-12 text-amber-500" />
        <h1 className="mt-4 text-xl font-semibold text-slate-100">Access Denied</h1>
        <p className="mt-2 text-sm text-slate-500">
          You do not have permission to access this page.
        </p>
        <Link
          href="/"
          className="mt-4 rounded-md border border-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
        >
          Return to Browse
        </Link>
      </div>
    );
  }

  const handleApprove = async (appId: string) => {
    setProcessingId(appId);
    try {
      // TODO: Call approve_app on contract
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPendingApps((prev) => prev.filter((app) => app.id.toString() !== appId));
    } catch (error) {
      console.error("Approve error:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (appId: string) => {
    if (!rejectReason.trim()) return;
    setProcessingId(appId);
    try {
      // TODO: Call reject_app on contract with reason
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPendingApps((prev) => prev.filter((app) => app.id.toString() !== appId));
      setShowRejectModal(null);
      setRejectReason("");
    } catch (error) {
      console.error("Reject error:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleFeature = async (appId: string) => {
    setProcessingId(appId);
    try {
      // TODO: Call feature_app on contract
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Featured app:", appId);
    } catch (error) {
      console.error("Feature error:", error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review and manage pending application submissions.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-500">Pending Review</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100">{pendingApps.length}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-500">Approved Today</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100">0</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-500">Total Applications</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100">1</p>
        </div>
      </div>

      {/* Pending apps */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-slate-100">Pending Applications</h2>
        {pendingApps.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
            <Check className="h-8 w-8 text-emerald-500" />
            <h3 className="mt-3 text-base font-medium text-slate-200">All caught up</h3>
            <p className="mt-1 text-sm text-slate-500">No pending applications to review.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {pendingApps.map((app) => (
              <div
                key={app.id.toString()}
                className="rounded-lg border border-slate-800 bg-slate-900/50 p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* Logo */}
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800">
                    {app.logoUrl ? (
                      <Image src={app.logoUrl} alt={app.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-600">
                        {app.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-medium text-slate-100">{app.name}</h3>
                      <Badge variant="default">{app.category}</Badge>
                      {app.builtWithVarity && <Badge variant="success">Verified</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{app.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span>Developer: {app.developer.slice(0, 10)}...</span>
                      <a
                        href={app.appUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View App
                      </a>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-800/50 pt-4">
                  <button
                    onClick={() => handleApprove(app.id.toString())}
                    disabled={processingId === app.id.toString()}
                    className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => setShowRejectModal(app.id.toString())}
                    disabled={processingId === app.id.toString()}
                    className="inline-flex items-center gap-2 rounded-md border border-red-900 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-950 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleFeature(app.id.toString())}
                    disabled={processingId === app.id.toString()}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 disabled:opacity-50"
                  >
                    <Star className="h-4 w-4" />
                    Feature
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-lg font-medium text-slate-100">Reject Application</h3>
            <p className="mt-2 text-sm text-slate-500">
              Please provide a reason for rejection. This will be shared with the developer.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Reason for rejection..."
              className="mt-4 w-full resize-none rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason("");
                }}
                className="rounded-md border border-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={!rejectReason.trim() || processingId === showRejectModal}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-50"
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
