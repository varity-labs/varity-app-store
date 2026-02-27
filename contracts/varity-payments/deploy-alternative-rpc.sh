#!/bin/bash

# Try different RPC endpoints - some have better gas estimation

set -e

if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: Set PRIVATE_KEY first: export PRIVATE_KEY='0x...'"
    exit 1
fi

echo "🔧 Trying alternative RPC endpoints..."
echo ""

# List of Arbitrum One RPC endpoints
RPCS=(
    "https://rpc.ankr.com/arbitrum"
    "https://arbitrum.llamarpc.com"
    "https://arbitrum.blockpi.network/v1/rpc/public"
    "https://arb1.arbitrum.io/rpc"
)

for RPC in "${RPCS[@]}"; do
    echo "📡 Trying: $RPC"
    
    cargo stylus deploy \
        --private-key $PRIVATE_KEY \
        --endpoint $RPC \
        --no-verify \
        2>&1 | head -50
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ SUCCESS with RPC: $RPC"
        exit 0
    else
        echo "❌ Failed with this RPC, trying next..."
        echo ""
    fi
done

echo "❌ All RPC endpoints failed. Need to use manual cast deployment."
