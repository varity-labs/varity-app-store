#!/bin/bash
set -e

CONTRACT_ADDRESS="${1:-}"

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "Usage: ./post-deploy.sh <contract_address>"
    exit 1
fi

echo "=========================================="
echo "Post-Deployment Setup"
echo "=========================================="
echo ""
echo "Contract Address: $CONTRACT_ADDRESS"
echo ""

# Create deployment record
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
DEPLOYMENT_FILE="deployment_$(date +%Y%m%d_%H%M%S).json"

cat > $DEPLOYMENT_FILE <<EOF
{
  "timestamp": "$TIMESTAMP",
  "network": "Varity L3 Testnet",
  "chainId": 33529,
  "contractAddress": "$CONTRACT_ADDRESS",
  "explorer": "https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz/address/$CONTRACT_ADDRESS",
  "version": "0.1.0"
}
EOF

echo "[1/5] Deployment record created: $DEPLOYMENT_FILE"

# Export ABI
echo ""
echo "[2/5] Exporting ABI..."
./export-abi.sh

# Update frontend config
echo ""
echo "[3/5] Updating frontend configuration..."
FRONTEND_ENV="../frontend/.env.local"

if [ -f "$FRONTEND_ENV" ]; then
    # Backup existing file
    cp $FRONTEND_ENV "${FRONTEND_ENV}.backup"
    echo "Backed up existing config to ${FRONTEND_ENV}.backup"
fi

cat > $FRONTEND_ENV <<EOF
# Varity App Registry Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS
NEXT_PUBLIC_CHAIN_ID=33529
NEXT_PUBLIC_RPC_URL=https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz
NEXT_PUBLIC_EXPLORER_URL=https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz

# Updated: $TIMESTAMP
EOF

echo "Frontend config updated: $FRONTEND_ENV"

# Copy ABI to frontend
echo ""
echo "[4/5] Copying ABI to frontend..."
mkdir -p ../frontend/src/contracts
cp abi/VarityAppRegistry.json ../frontend/src/contracts/
echo "ABI copied to ../frontend/src/contracts/"

# Verify deployment
echo ""
echo "[5/5] Running deployment tests..."
CONTRACT_ADDRESS=$CONTRACT_ADDRESS ./test-deployment.sh

echo ""
echo "=========================================="
echo "Post-Deployment Complete!"
echo "=========================================="
echo ""
echo "Summary:"
echo "- Contract: $CONTRACT_ADDRESS"
echo "- Deployment record: $DEPLOYMENT_FILE"
echo "- Frontend config updated"
echo "- ABI exported and copied"
echo "- Deployment verified"
echo ""
echo "Next steps:"
echo "1. Restart frontend: cd ../frontend && npm run dev"
echo "2. Test contract interaction in UI"
echo "3. Register first app"
echo "4. Share deployment record with team"
