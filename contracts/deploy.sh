#!/bin/bash
set -e

ENDPOINT="https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz"
PRIVATE_KEY="${PRIVATE_KEY:-}"

if [ -z "$PRIVATE_KEY" ]; then
    echo "Error: PRIVATE_KEY environment variable required"
    echo "Usage: PRIVATE_KEY=your_key ./deploy.sh"
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

echo "[1/4] Building contract..."
cargo build --release --target wasm32-unknown-unknown

echo ""
echo "[2/4] Checking contract compatibility..."
cargo stylus check --endpoint $ENDPOINT

echo ""
echo "[3/4] Deploying to Varity L3..."
cargo stylus deploy \
  --endpoint $ENDPOINT \
  --private-key $PRIVATE_KEY

echo ""
echo "[4/4] Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Save the contract address from the output above"
echo "2. Update frontend .env with CONTRACT_ADDRESS"
echo "3. Verify contract on explorer: https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz"
