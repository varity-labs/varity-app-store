"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { TransactionButton } from "thirdweb/react";
import { prepareContractCall, readContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { getPaymentsContract, PAYMENTS_ABI } from "@/lib/contracts";
import { thirdwebClient, varityL3 } from "@/lib/thirdweb";

interface PurchaseButtonProps {
  appId: bigint;
  className?: string;
}

interface AppPricing {
  priceUsdc: bigint;
  developer: string;
  isSubscription: boolean;
  intervalDays: bigint;
  isActive: boolean;
}

export function PurchaseButton({ appId, className = "" }: PurchaseButtonProps): React.JSX.Element {
  const [pricing, setPricing] = useState<AppPricing | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const account = useActiveAccount();

  // Fetch pricing and purchase status
  useEffect(() => {
    async function fetchPricingData() {
      try {
        setIsLoading(true);
        const contract = getPaymentsContract();

        // Get app pricing (using camelCase - Stylus SDK conversion)
        const pricingData = await readContract({
          contract,
          method: PAYMENTS_ABI.find(m => m.name === "getAppPricing")!,
          params: [appId],
        }) as [bigint, string, boolean, bigint, boolean];

        setPricing({
          priceUsdc: pricingData[0],
          developer: pricingData[1],
          isSubscription: pricingData[2],
          intervalDays: pricingData[3],
          isActive: pricingData[4],
        });

        // Check if user has purchased (if connected, using camelCase)
        if (account?.address) {
          const purchased = await readContract({
            contract,
            method: PAYMENTS_ABI.find(m => m.name === "hasUserPurchased")!,
            params: [appId, account.address],
          }) as boolean;
          setHasPurchased(purchased);
        }
      } catch (err) {
        console.error("Failed to fetch pricing:", err);
        // App might not have pricing set
        setPricing(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPricingData();
  }, [appId, account?.address]);

  // Format price (USDC has 6 decimals)
  function formatPrice(priceUsdc: bigint): string {
    const dollars = Number(priceUsdc) / 1_000_000;
    return dollars.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-3 text-slate-400 ${className}`}>
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading...
      </div>
    );
  }

  // No pricing set - app is free or not for sale
  if (!pricing || !pricing.isActive || pricing.priceUsdc === BigInt(0)) {
    return <></>; // Don't show purchase button for free apps
  }

  // Already purchased
  if (hasPurchased) {
    return (
      <div className={`inline-flex items-center gap-2 rounded-xl bg-green-500/20 px-6 py-3 text-green-400 ${className}`}>
        <Check className="h-5 w-5" />
        Purchased
      </div>
    );
  }

  // TransactionButton with thirdweb Pay (credit card)
  return (
    <TransactionButton
      transaction={async () => {
        const contract = getPaymentsContract();
        return prepareContractCall({
          contract,
          method: PAYMENTS_ABI.find(m => m.name === "purchaseApp")!,
          params: [appId],
          value: pricing.priceUsdc,
        });
      }}
      onTransactionConfirmed={() => {
        setHasPurchased(true);
      }}
      payModal={{
        theme: "dark",
        metadata: {
          name: pricing.isSubscription ? `Subscription - ${formatPrice(pricing.priceUsdc)}/mo` : `Purchase`,
          image: "/logo/varity-logo-color.svg",
        },
      }}
      className={className}
    >
      <div className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg transition-all hover:bg-brand-400 hover:shadow-xl">
        <ShoppingCart className="h-5 w-5" />
        💳 Buy {formatPrice(pricing.priceUsdc)} with Card
        {pricing.isSubscription && <span className="text-sm">/mo</span>}
      </div>
    </TransactionButton>
  );
}
