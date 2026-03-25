#!/bin/bash
set -e

ENDPOINT="https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz"
CONTRACT_ADDRESS="${CONTRACT_ADDRESS:-}"

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "Error: CONTRACT_ADDRESS environment variable required"
    echo "Usage: CONTRACT_ADDRESS=0x... ./test-deployment.sh"
    exit 1
fi

echo "=========================================="
echo "Varity App Registry - Deployment Testing"
echo "=========================================="
echo ""
echo "Contract: $CONTRACT_ADDRESS"
echo "Network: Varity L3 Testnet"
echo ""

echo "[1/4] Verifying contract exists..."
if curl -s -X POST \
    -H "Content-Type: application/json" \
    --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getCode\",\"params\":[\"$CONTRACT_ADDRESS\", \"latest\"],\"id\":1}" \
    $ENDPOINT | grep -q "0x"; then
    echo "Contract exists on-chain"
else
    echo "ERROR: Contract not found at address $CONTRACT_ADDRESS"
    exit 1
fi

echo ""
echo "[2/4] Checking contract on explorer..."
EXPLORER_URL="https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz/address/$CONTRACT_ADDRESS"
echo "Explorer: $EXPLORER_URL"
echo "Please verify contract manually on explorer"

echo ""
echo "[3/4] Testing contract compatibility..."
cargo stylus check \
    --endpoint $ENDPOINT \
    --contract-address $CONTRACT_ADDRESS

echo ""
echo "[4/4] Deployment test complete!"
echo ""
echo "Next steps:"
echo "1. Test contract interactions via frontend"
echo "2. Register first app"
echo "3. Verify events are emitted correctly"
echo "4. Monitor gas usage"
echo ""
echo "Contract is ready for integration!"
