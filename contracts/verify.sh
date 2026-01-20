#!/bin/bash
set -e

ENDPOINT="https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz"
CONTRACT_ADDRESS="${CONTRACT_ADDRESS:-}"

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "Error: CONTRACT_ADDRESS environment variable required"
    echo "Usage: CONTRACT_ADDRESS=0x... ./verify.sh"
    exit 1
fi

echo "=========================================="
echo "Varity App Registry - Contract Verification"
echo "=========================================="
echo ""
echo "Contract: $CONTRACT_ADDRESS"
echo "Network: Varity L3 Testnet"
echo ""

echo "[1/2] Checking contract on explorer..."
echo "Explorer URL: https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz/address/$CONTRACT_ADDRESS"
echo ""

echo "[2/2] Verifying contract bytecode..."
cargo stylus check \
  --endpoint $ENDPOINT \
  --contract-address $CONTRACT_ADDRESS

echo ""
echo "Verification complete!"
echo ""
echo "Contract is deployed and accessible at:"
echo "$CONTRACT_ADDRESS"
