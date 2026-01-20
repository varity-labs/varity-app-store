#!/bin/bash

ENDPOINT="https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz"

echo "=========================================="
echo "Varity L3 Gas Price Check"
echo "=========================================="
echo ""

# Get current gas price
GAS_PRICE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}' \
    $ENDPOINT | grep -oP '"result":"\K[^"]+')

if [ -z "$GAS_PRICE" ]; then
    echo "Error: Could not fetch gas price"
    exit 1
fi

# Convert from hex to decimal
GAS_PRICE_DEC=$((GAS_PRICE))

# Convert to Gwei (1 Gwei = 10^9 wei)
GAS_PRICE_GWEI=$(echo "scale=2; $GAS_PRICE_DEC / 1000000000" | bc)

# Estimate deployment cost (approximate)
ESTIMATED_GAS=500000  # Approximate gas for deployment
COST_WEI=$(echo "$GAS_PRICE_DEC * $ESTIMATED_GAS" | bc)
COST_USDC=$(echo "scale=6; $COST_WEI / 1000000" | bc)

echo "Current Network Status:"
echo "----------------------"
echo "Gas Price: $GAS_PRICE_GWEI Gwei"
echo "Gas Price (wei): $GAS_PRICE_DEC"
echo ""
echo "Estimated Deployment Cost:"
echo "-------------------------"
echo "Gas estimate: $ESTIMATED_GAS"
echo "Cost: ~$COST_USDC USDC"
echo ""

# Check if gas price is reasonable
if (( $(echo "$GAS_PRICE_GWEI > 10" | bc -l) )); then
    echo "WARNING: Gas price is high. Consider waiting for lower fees."
elif (( $(echo "$GAS_PRICE_GWEI > 5" | bc -l) )); then
    echo "NOTICE: Gas price is moderate."
else
    echo "GOOD: Gas price is low. Good time to deploy."
fi

echo ""
echo "Note: These are estimates. Actual costs may vary."
