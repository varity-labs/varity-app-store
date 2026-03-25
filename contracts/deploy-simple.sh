#!/bin/bash
set -e

ENDPOINT="https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz"
WASM_FILE="target/wasm32-unknown-unknown/release/varity_app_registry.wasm"

if [ -z "$PRIVATE_KEY" ]; then
    echo "=========================================="
    echo "Varity App Registry - Contract Deployment"
    echo "=========================================="
    echo ""
    echo "Error: PRIVATE_KEY environment variable required"
    echo ""
    echo "Usage:"
    echo "  PRIVATE_KEY=your_private_key ./deploy-simple.sh"
    echo ""
    echo "Make sure your wallet has USDC on Varity L3 testnet"
    echo "Chain ID: 33529"
    echo ""
    exit 1
fi

echo "=========================================="
echo "Varity App Registry - Contract Deployment"
echo "=========================================="
echo ""
echo "Network: Varity L3 Testnet"
echo "Chain ID: 33529"
echo "RPC: $ENDPOINT"
echo ""

# Build
echo "[1/3] Building contract..."
cargo build --release --target wasm32-unknown-unknown 2>&1 | grep -v "^warning:" || true

echo ""
echo "[2/3] Deploying to Varity L3..."
echo ""

# Deploy (builds from source)
DEPLOY_OUTPUT=$(cargo stylus deploy \
    --endpoint $ENDPOINT \
    --private-key $PRIVATE_KEY \
    --no-verify 2>&1) || true

echo "$DEPLOY_OUTPUT"

# Extract contract address
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oP "deployed code at address: \K0x[a-fA-F0-9]{40}" || \
                   echo "$DEPLOY_OUTPUT" | grep -oP "contract address: \K0x[a-fA-F0-9]{40}" || \
                   echo "$DEPLOY_OUTPUT" | grep -oP "0x[a-fA-F0-9]{40}" | head -1 || echo "")

echo ""
echo "[3/3] Deployment Results"
echo ""

if [ -n "$CONTRACT_ADDRESS" ]; then
    echo "=========================================="
    echo "Deployment Successful!"
    echo "=========================================="
    echo ""
    echo "Contract Address: $CONTRACT_ADDRESS"
    echo "Explorer: https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz/address/$CONTRACT_ADDRESS"
    echo ""
    echo "Next steps:"
    echo "1. Update frontend .env.local with:"
    echo "   NEXT_PUBLIC_VARITY_REGISTRY_ADDRESS=$CONTRACT_ADDRESS"
    echo ""
else
    echo "=========================================="
    echo "Check the output above for deployment status"
    echo "=========================================="
    echo ""
    echo "If deployment succeeded, look for the contract address in the output above"
    echo "Then update frontend .env.local with:"
    echo "   NEXT_PUBLIC_VARITY_REGISTRY_ADDRESS=<contract_address>"
    echo ""
fi
