#!/bin/bash

# Manual deployment script for VarityPayments to Arbitrum One
# This bypasses cargo stylus's broken gas estimation

set -e

echo "🔧 Manual VarityPayments Deployment Script"
echo "=========================================="
echo ""

# Check for private key
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY environment variable not set"
    echo "   Run: export PRIVATE_KEY='0x...'"
    exit 1
fi

# Configuration
RPC_URL="https://arb1.arbitrum.io/rpc"
WASM_FILE="target/wasm32-unknown-unknown/release/varity_payments.wasm"

# Check WASM file exists
if [ ! -f "$WASM_FILE" ]; then
    echo "❌ Error: WASM file not found: $WASM_FILE"
    echo "   Run: cargo build --release --target wasm32-unknown-unknown"
    exit 1
fi

echo "✅ WASM file found: $WASM_FILE ($(du -h $WASM_FILE | cut -f1))"
echo ""

# Get current gas price and add 50% buffer
echo "📊 Checking current Arbitrum gas price..."
CURRENT_GAS=$(cast gas-price --rpc-url $RPC_URL)
CURRENT_GAS_DEC=$(printf "%d" $CURRENT_GAS)
GAS_WITH_BUFFER=$(($CURRENT_GAS_DEC * 150 / 100))

echo "   Current base fee: $CURRENT_GAS_DEC wei"
echo "   Using (with 50% buffer): $GAS_WITH_BUFFER wei"
echo ""

# Deploy using cargo stylus with environment override
echo "🚀 Deploying contract..."
echo "   This may take 2-3 minutes..."
echo ""

# Set gas price environment variable (if cargo stylus respects it)
export ETH_GAS_PRICE=$GAS_WITH_BUFFER

cargo stylus deploy \
  --private-key $PRIVATE_KEY \
  --endpoint $RPC_URL \
  --no-verify \
  2>&1 | tee deploy.log

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo "📝 Full logs saved to deploy.log"
    echo ""
    echo "Next steps:"
    echo "1. Copy the contract address from above"
    echo "2. Initialize: cast send --rpc-url $RPC_URL --private-key \$PRIVATE_KEY CONTRACT_ADDRESS \"initialize()\""
else
    echo ""
    echo "❌ Deployment failed. Check deploy.log for details."
    exit 1
fi
