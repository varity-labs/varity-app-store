#!/bin/bash
set -e

ENDPOINT="https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz"
PRIVATE_KEY="${PRIVATE_KEY:-}"

if [ -z "$PRIVATE_KEY" ]; then
    echo "Error: PRIVATE_KEY environment variable required"
    echo "Usage: PRIVATE_KEY=your_key ./deploy-and-verify.sh"
    exit 1
fi

echo "=========================================="
echo "Varity App Registry - Full Deployment"
echo "=========================================="
echo ""

# Build
echo "[1/6] Building contract..."
cargo build --release --target wasm32-unknown-unknown

# Check
echo ""
echo "[2/6] Checking Stylus compatibility..."
cargo stylus check --endpoint $ENDPOINT

# Deploy
echo ""
echo "[3/6] Deploying to Varity L3..."
DEPLOY_OUTPUT=$(cargo stylus deploy \
    --endpoint $ENDPOINT \
    --private-key $PRIVATE_KEY 2>&1)

echo "$DEPLOY_OUTPUT"

# Extract contract address
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oP "deployed code at address: \K0x[a-fA-F0-9]{40}" || echo "")

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo ""
    echo "Error: Could not extract contract address from deployment output"
    echo "Please check the output above and run post-deployment manually"
    exit 1
fi

echo ""
echo "Contract deployed at: $CONTRACT_ADDRESS"

# Verify
echo ""
echo "[4/6] Verifying deployment..."
sleep 5  # Wait for block confirmation
CONTRACT_ADDRESS=$CONTRACT_ADDRESS ./verify.sh

# Export ABI
echo ""
echo "[5/6] Exporting ABI..."
./export-abi.sh

# Post-deploy setup
echo ""
echo "[6/6] Running post-deployment setup..."
./scripts/post-deploy.sh $CONTRACT_ADDRESS

echo ""
echo "=========================================="
echo "Deployment Successful!"
echo "=========================================="
echo ""
echo "Contract Address: $CONTRACT_ADDRESS"
echo "Explorer: https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz/address/$CONTRACT_ADDRESS"
echo ""
echo "All done! Contract is ready to use."
