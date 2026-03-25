#!/bin/bash
set -e

# Deploy VarityPayments to Arbitrum One (mainnet)
# This deploys the ERC-20 USDC version of the contract

ENDPOINT="https://arb1.arbitrum.io/rpc"
PRIVATE_KEY="${PRIVATE_KEY:-}"

if [ -z "$PRIVATE_KEY" ]; then
    echo "Error: PRIVATE_KEY environment variable required"
    echo "Usage: PRIVATE_KEY=your_key ./deploy-arb-one.sh"
    echo ""
    echo "NOTE: The deployer wallet needs ETH on Arbitrum One for gas."
    echo "Get ETH on Arb One via bridge.arbitrum.io or an exchange."
    exit 1
fi

echo "=========================================="
echo "VarityPayments - Arbitrum One Deployment"
echo "=========================================="
echo ""
echo "Network: Arbitrum One (MAINNET)"
echo "Chain ID: 42161"
echo "RPC: $ENDPOINT"
echo "USDC: 0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
echo "Treasury: 0xA0b83bBeF45FeE8c8E158b25b736E05eBd51b793"
echo ""

echo "[1/5] Building contract..."
cd varity-payments
cargo build --release --target wasm32-unknown-unknown

echo ""
echo "[2/5] Checking contract compatibility with Arbitrum One..."
cargo stylus check --endpoint $ENDPOINT

echo ""
echo "[3/5] Deploying to Arbitrum One..."
DEPLOY_OUTPUT=$(cargo stylus deploy \
  --endpoint $ENDPOINT \
  --private-key $PRIVATE_KEY 2>&1)

echo "$DEPLOY_OUTPUT"

# Extract contract address from output
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oP '0x[a-fA-F0-9]{40}' | tail -1)

echo ""
echo "[4/5] Initializing contract..."
if [ -n "$CONTRACT_ADDRESS" ]; then
    echo "Contract deployed at: $CONTRACT_ADDRESS"

    # Call initialize() on the contract
    cast send $CONTRACT_ADDRESS "initialize()" \
        --rpc-url $ENDPOINT \
        --private-key $PRIVATE_KEY \
        2>/dev/null || echo "Note: initialize() may have already been called"

    echo ""
    echo "[5/5] Deployment complete!"
    echo ""
    echo "=========================================="
    echo "CONTRACT ADDRESS: $CONTRACT_ADDRESS"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Verify on Arbiscan: https://arbiscan.io/address/$CONTRACT_ADDRESS"
    echo "2. Set env var in all repos:"
    echo "   NEXT_PUBLIC_VARITY_PAYMENTS_ADDRESS=$CONTRACT_ADDRESS"
    echo "3. Update .env.local in:"
    echo "   - varity-app-store-developer/"
    echo "   - varity-app-store/"
    echo "4. Rebuild and deploy frontends"
else
    echo "WARNING: Could not extract contract address from output."
    echo "Check the deploy output above for the address."
fi
