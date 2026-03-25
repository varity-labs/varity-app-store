#!/bin/bash
# Emergency deployment script - generates throwaway wallet for deployment

echo "=========================================="
echo "Varity App Registry - Emergency Deployment"
echo "=========================================="
echo ""
echo "Generating deployment wallet..."

# Generate a random private key (64 hex chars)
PRIVATE_KEY="0x$(openssl rand -hex 32)"
ADDRESS=$(cast wallet address $PRIVATE_KEY 2>/dev/null || echo "N/A (install foundry)")

echo "Deployment Wallet: $ADDRESS"
echo "Private Key: $PRIVATE_KEY"
echo ""
echo "⚠️  MANUAL STEP REQUIRED:"
echo "1. Send 0.1 USDC to: $ADDRESS"
echo "2. Wait for confirmation"
echo "3. Run: PRIVATE_KEY=$PRIVATE_KEY ./deploy-simple.sh"
echo ""
