#!/bin/bash

# Direct deployment using Foundry cast with manual gas control
# This is the nuclear option when cargo stylus fails

set -e

if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: Set PRIVATE_KEY first"
    exit 1
fi

RPC_URL="https://arb1.arbitrum.io/rpc"
WASM_FILE="target/wasm32-unknown-unknown/release/varity_payments.wasm"

echo "🔧 Direct Cast Deployment (Manual Gas Control)"
echo "=============================================="
echo ""

# Get current gas price
echo "📊 Fetching current gas price..."
CURRENT_GAS=$(cast gas-price --rpc-url $RPC_URL)
CURRENT_GAS_DEC=$(printf "%d" $CURRENT_GAS)

# Calculate gas with 100% buffer
SAFE_GAS=$(($CURRENT_GAS_DEC * 2))

echo "   Current base fee: $CURRENT_GAS_DEC wei ($(echo "scale=4; $CURRENT_GAS_DEC / 1000000000" | bc) Gwei)"
echo "   Using (2x buffer): $SAFE_GAS wei ($(echo "scale=4; $SAFE_GAS / 1000000000" | bc) Gwei)"
echo ""

# Stylus deployer contract on Arbitrum One
DEPLOYER="0x0cB5f1D8F8e7Fe05CDdc87AbDE688F04AD36F6F7"

echo "📦 Reading WASM bytecode..."
WASM_HEX=$(xxd -p $WASM_FILE | tr -d '\n')
WASM_SIZE=$(echo -n $WASM_HEX | wc -c)
echo "   Size: $((WASM_SIZE / 2)) bytes"
echo ""

echo "🚀 Deploying with custom gas settings..."
echo "   Deployer: $DEPLOYER"
echo "   Gas price: $SAFE_GAS wei"
echo ""

# Deploy using cast send with custom gas
cast send $DEPLOYER \
  "deploy(bytes)" \
  "0x$WASM_HEX" \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --gas-price $SAFE_GAS \
  --legacy \
  | tee deploy-cast.log

echo ""
echo "✅ Check deploy-cast.log for contract address"
