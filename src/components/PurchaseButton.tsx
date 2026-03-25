"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { TransactionButton } from "thirdweb/react";
import { prepareContractCall, readContract, getContract } from "thirdweb";
import { approve } from "thirdweb/extensions/erc20";
import { useActiveAccount } from "thirdweb/react";
import { getPaymentsContract, PAYMENTS_ABI, VARITY_PAYMENTS_ADDRESS } from "@/lib/contracts";
import { thirdwebClient, arbitrumOne } from "@/lib/thirdweb";

/** USDC contract address on Arbitrum One */
const USDC_ADDRESS = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";

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
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [hasAllowance, setHasAllowance] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const account = useActiveAccount();

  // Fetch pricing, purchase status, and allowance
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // Skip if payments contract not configured (beta/development mode)
        if (!process.env.NEXT_PUBLIC_VARITY_PAYMENTS_ADDRESS) {
          setIsLoading(false);
          setError("Payments not configured yet");
          return;
        }

        const contract = getPaymentsContract();

        // Get app pricing
        const pricingData = await readContract({
          contract,
          method: PAYMENTS_ABI.find(m => m.name === "getAppPricing")!,
          params: [appId],
        }) as [bigint, string, boolean, bigint, boolean];

        const appPricing: AppPricing = {
          priceUsdc: pricingData[0],
          developer: pricingData[1],
          isSubscription: pricingData[2],
          intervalDays: pricingData[3],
          isActive: pricingData[4],
        };
        setPricing(appPricing);

        if (account?.address) {
          // Check if already purchased
          const purchased = await readContract({
            contract,
            method: PAYMENTS_ABI.find(m => m.name === "hasUserPurchased")!,
            params: [appId, account.address],
          }) as boolean;
          setHasPurchased(purchased);

          // Check USDC allowance — skip authorize step if sufficient
          if (!purchased && appPricing.isActive && appPricing.priceUsdc > BigInt(0)) {
            try {
              const usdcContract = getContract({
                client: thirdwebClient,
                chain: arbitrumOne,
                address: USDC_ADDRESS,
              });
              const currentAllowance = await readContract({
                contract: usdcContract,
                method: "function allowance(address owner, address spender) view returns (uint256)",
                params: [account.address, VARITY_PAYMENTS_ADDRESS],
              });
              setHasAllowance(BigInt(currentAllowance.toString()) >= appPricing.priceUsdc);
            } catch {
              setHasAllowance(false);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch pricing:", err);
        setPricing(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
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

  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-3 text-slate-400 ${className}`}>
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading...
      </div>
    );
  }

  // No pricing set — app is free
  if (!pricing || !pricing.isActive || pricing.priceUsdc === BigInt(0)) {
    return <></>;
  }

  if (hasPurchased) {
    return (
      <div className={`inline-flex items-center gap-2 rounded-xl bg-green-500/20 px-6 py-3 text-green-400 ${className}`}>
        <Check className="h-5 w-5" />
        Purchased
      </div>
    );
  }

  const needsAuthorization = hasAllowance === false && !isAuthorized;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {needsAuthorization ? (
        /* Step 1: Authorize payment */
        <TransactionButton
          transaction={() => {
            const usdcContract = getContract({
              client: thirdwebClient,
              chain: arbitrumOne,
              address: USDC_ADDRESS,
            });
            return approve({
              contract: usdcContract,
              spender: VARITY_PAYMENTS_ADDRESS,
              amount: Number(pricing.priceUsdc) / 1_000_000, // dollars — thirdweb handles decimals
            });
          }}
          onTransactionConfirmed={() => {
            setIsAuthorized(true);
            setError(null);
          }}
          onError={(err) => {
            setError("Authorization failed. Please try again.");
            console.error("Purchase authorization failed:", err);
          }}
          payModal={{
            theme: "dark",
            metadata: {
              name: pricing.isSubscription ? `Subscribe — ${formatPrice(pricing.priceUsdc)}/mo` : `Purchase — ${formatPrice(pricing.priceUsdc)}`,
              image: "/logo/varity-logo-color.svg",
            },
          }}
        >
          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-6 py-3 text-base font-semibold text-slate-200 shadow-lg transition-all hover:bg-slate-600 hover:shadow-xl">
            <ShoppingCart className="h-5 w-5" />
            Authorize {formatPrice(pricing.priceUsdc)} Payment
          </div>
        </TransactionButton>
      ) : (
        /* Step 2 (or only step if allowance exists): Complete purchase */
        <TransactionButton
          transaction={async () => {
            const contract = getPaymentsContract();
            return prepareContractCall({
              contract,
              method: PAYMENTS_ABI.find(m => m.name === "purchaseApp")!,
              params: [appId],
            });
          }}
          onTransactionConfirmed={() => {
            setHasPurchased(true);
            setError(null);
          }}
          onError={(err) => {
            setError("Purchase failed. Please try again.");
            console.error("Purchase failed:", err);
          }}
          payModal={{
            theme: "dark",
            metadata: {
              name: pricing.isSubscription ? `Subscribe — ${formatPrice(pricing.priceUsdc)}/mo` : `Purchase — ${formatPrice(pricing.priceUsdc)}`,
              image: "/logo/varity-logo-color.svg",
            },
          }}
        >
          <div className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg transition-all hover:bg-brand-400 hover:shadow-xl">
            <ShoppingCart className="h-5 w-5" />
            Buy {formatPrice(pricing.priceUsdc)} with Card
            {pricing.isSubscription && <span className="text-sm">/mo</span>}
          </div>
        </TransactionButton>
      )}
    </div>
  );
}
