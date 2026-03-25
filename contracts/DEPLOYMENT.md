# Deployment Guide - Varity App Registry

Complete guide for deploying the Varity App Registry smart contract.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Testnet Deployment](#testnet-deployment)
4. [Mainnet Deployment](#mainnet-deployment)
5. [Post-Deployment](#post-deployment)
6. [CI/CD Deployment](#cicd-deployment)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

1. **Rust Toolchain** (1.75.0 or later)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   rustup target add wasm32-unknown-unknown
   ```

2. **Cargo Stylus**
   ```bash
   cargo install cargo-stylus
   ```

3. **Make** (optional, for Makefile usage)
   ```bash
   # Ubuntu/Debian
   sudo apt install make

   # macOS
   brew install make
   ```

### Wallet Setup

1. **Create/Import Wallet**
   - Use MetaMask, Frame, or similar
   - Export private key securely
   - **Never share or commit private keys**

2. **Get USDC for Gas**
   - Bridge USDC to Varity L3
   - Testnet: Use faucet (if available)
   - Mainnet: Bridge from Ethereum/Arbitrum

### Network Configuration

**Varity L3 Testnet**
- Network Name: Varity L3 Testnet
- RPC URL: https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz
- Chain ID: 33529
- Currency Symbol: USDC
- Block Explorer: https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz

**Varity L3 Mainnet** (Coming Soon)
- Network Name: Varity L3
- RPC URL: TBD
- Chain ID: TBD
- Currency Symbol: USDC

## Local Development

### 1. Setup Environment

```bash
cd varity-app-store/contracts

# Copy environment template
cp .env.example .env

# Edit .env with your private key
# NEVER commit this file
```

### 2. Build Contract

```bash
# Using make
make build

# Or directly with cargo
cargo build --release --target wasm32-unknown-unknown
```

### 3. Run Tests

```bash
# Using make
make test

# Or directly with cargo
cargo test
```

### 4. Check Stylus Compatibility

```bash
# Using make
make check

# Or directly
cargo stylus check --endpoint https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz
```

## Testnet Deployment

### Method 1: Using Deployment Script

```bash
# Set private key
export PRIVATE_KEY="your_private_key_here"

# Run deployment
./deploy.sh
```

### Method 2: Using Makefile

```bash
make deploy PRIVATE_KEY=your_private_key_here
```

### Method 3: Manual Deployment

```bash
# Build
cargo build --release --target wasm32-unknown-unknown

# Check
cargo stylus check \
  --endpoint https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz

# Deploy
cargo stylus deploy \
  --endpoint https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz \
  --private-key $PRIVATE_KEY
```

### Expected Output

```
Compiling...
Contract size: X KB
Deploying to Varity L3 Testnet...
Transaction hash: 0x...
deployed code at address: 0x1234567890123456789012345678901234567890
Deployment successful!
```

**IMPORTANT:** Save the contract address!

## Mainnet Deployment

### Pre-Deployment Checklist

- [ ] Contract fully tested on testnet
- [ ] All tests passing
- [ ] Security audit completed (recommended)
- [ ] Gas price acceptable
- [ ] Sufficient USDC for deployment
- [ ] Backup private key securely
- [ ] Team notified of deployment
- [ ] Rollback plan prepared

### Deployment Steps

1. **Final Testing**
   ```bash
   cargo test
   make check
   ```

2. **Update RPC Endpoint** (when mainnet available)
   ```bash
   export ENDPOINT="https://rpc-varity-mainnet.example.com"
   ```

3. **Deploy**
   ```bash
   export PRIVATE_KEY="your_mainnet_private_key"

   cargo stylus deploy \
     --endpoint $ENDPOINT \
     --private-key $PRIVATE_KEY
   ```

4. **Verify Deployment**
   ```bash
   make verify CONTRACT_ADDRESS=0x...
   ```

## Post-Deployment

### 1. Verify on Explorer

Visit the block explorer and verify:
- Contract code is visible
- Contract creation transaction succeeded
- Contract balance is zero (expected)

```
https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz/address/0x...
```

### 2. Export ABI

```bash
# Export ABI for frontend integration
./export-abi.sh

# Copy to frontend
cp abi/VarityAppRegistry.json ../frontend/src/contracts/
```

### 3. Update Environment Variables

**Frontend (.env.local)**
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=33529
NEXT_PUBLIC_RPC_URL=https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz
```

**Backend (.env)**
```env
CONTRACT_ADDRESS=0x...
VARITY_L3_RPC=https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz
```

### 4. Test Contract Interaction

```bash
# Test basic read function
# Example: Get total apps (should be 0 initially)
cast call 0x... "get_total_apps()" \
  --rpc-url https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz
```

### 5. Document Deployment

Create deployment record:
```bash
echo "Deployment Record" > DEPLOYMENT_RECORD.txt
echo "Date: $(date)" >> DEPLOYMENT_RECORD.txt
echo "Network: Varity L3 Testnet" >> DEPLOYMENT_RECORD.txt
echo "Contract Address: 0x..." >> DEPLOYMENT_RECORD.txt
echo "Deployer: 0x..." >> DEPLOYMENT_RECORD.txt
echo "Transaction: 0x..." >> DEPLOYMENT_RECORD.txt
```

## CI/CD Deployment

### GitHub Actions Setup

1. **Add Secrets**

   Go to Repository Settings > Secrets and Variables > Actions

   Add:
   - `TESTNET_PRIVATE_KEY` - Private key for testnet deployments
   - `MAINNET_PRIVATE_KEY` - Private key for mainnet deployments

2. **Trigger Deployment**

   - Go to Actions tab
   - Select "Deploy to Varity L3" workflow
   - Click "Run workflow"
   - Select environment (testnet/mainnet)
   - Click "Run workflow" button

3. **Monitor Deployment**

   - Watch workflow execution
   - Check for successful completion
   - Download deployment artifacts
   - Save contract address from logs

### Manual Workflow Trigger

```bash
# Using GitHub CLI
gh workflow run deploy.yml -f environment=testnet

# View runs
gh run list --workflow=deploy.yml
```

## Troubleshooting

### Build Issues

**Error: "wasm32-unknown-unknown not installed"**
```bash
rustup target add wasm32-unknown-unknown
```

**Error: "cargo-stylus not found"**
```bash
cargo install cargo-stylus
```

**Build fails with optimization errors**
```bash
# Try building without optimizations first
cargo build --target wasm32-unknown-unknown
```

### Deployment Issues

**Error: "Insufficient funds for gas"**
- Check wallet USDC balance
- Bridge more USDC to Varity L3
- Verify you're on correct network

**Error: "Invalid private key format"**
- Remove "0x" prefix if present
- Ensure key is 64 hex characters
- Check for whitespace or special characters

**Error: "RPC connection timeout"**
- Check RPC endpoint is accessible
- Verify network is operational
- Try alternative RPC endpoint (if available)

**Error: "Contract size exceeds limit"**
- Review contract optimization settings
- Remove unused dependencies
- Consider code refactoring

### Verification Issues

**Contract not visible on explorer**
- Wait for block confirmations (2-3 blocks)
- Refresh explorer page
- Verify correct address

**ABI export fails**
- Ensure export-abi feature is enabled
- Check Cargo.toml configuration
- Rebuild with feature flag

### Runtime Issues

**Transaction reverts with no error**
- Check function inputs are valid
- Verify caller has necessary permissions
- Review event logs on explorer

**Function calls fail**
- Verify contract is deployed
- Check ABI matches contract version
- Validate function parameters

## Security Best Practices

### Private Key Management

1. **Never commit private keys**
   - Add `.env` to `.gitignore`
   - Use environment variables
   - Consider using hardware wallets for mainnet

2. **Use separate keys for testnet/mainnet**
   - Different keys reduce risk
   - Testnet key can have fewer security measures
   - Mainnet key should use hardware wallet

3. **Rotate keys periodically**
   - Change deployment keys after major releases
   - Keep backup keys secure
   - Document key rotation process

### Deployment Security

1. **Verify contract code**
   - Review all changes before deployment
   - Run full test suite
   - Consider security audit for mainnet

2. **Test on testnet first**
   - Deploy to testnet
   - Run integration tests
   - Test all critical functions

3. **Monitor deployment**
   - Watch transaction confirmation
   - Verify contract address
   - Check initial state is correct

### Post-Deployment Security

1. **Monitor contract activity**
   - Set up alerts for unusual activity
   - Review transactions regularly
   - Monitor for exploit attempts

2. **Plan for upgrades**
   - Document upgrade process
   - Consider proxy patterns for future
   - Plan data migration strategy

3. **Incident response**
   - Have emergency contacts ready
   - Document pause/freeze procedures
   - Plan communication strategy

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Contract built successfully
- [ ] Stylus compatibility check passed
- [ ] Private key ready and secure
- [ ] Wallet has sufficient USDC
- [ ] RPC endpoint verified
- [ ] Team notified
- [ ] Deployment window scheduled

### During Deployment

- [ ] Private key set in environment
- [ ] Deployment command executed
- [ ] Transaction hash recorded
- [ ] Contract address recorded
- [ ] Deployment logs saved

### Post-Deployment

- [ ] Contract verified on explorer
- [ ] ABI exported
- [ ] Frontend environment updated
- [ ] Backend environment updated
- [ ] Contract interaction tested
- [ ] Deployment documented
- [ ] Team notified
- [ ] Monitoring configured

## Resources

- [Arbitrum Stylus Documentation](https://docs.arbitrum.io/stylus/stylus-gentle-introduction)
- [Cargo Stylus CLI](https://github.com/OffchainLabs/cargo-stylus)
- [Varity L3 Explorer](https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz)
- [Varity Documentation](../../varity-sdk/docs/)

## Support

For deployment issues:
- Check troubleshooting section above
- Review GitHub Issues
- Contact team in Discord
- Consult Varity documentation

## Appendix

### Useful Commands

```bash
# Quick deployment (testnet)
make deploy PRIVATE_KEY=xxx

# Full deployment with verification
make deploy-full PRIVATE_KEY=xxx

# Verify existing deployment
make verify CONTRACT_ADDRESS=0x...

# Export ABI
make export-abi

# Show network info
make info

# Clean build artifacts
make clean

# Development workflow
make dev
```

### Network Quick Reference

| Network | Chain ID | RPC | Explorer |
|---------|----------|-----|----------|
| Testnet | 33529 | https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz | https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz |
| Mainnet | TBD | TBD | TBD |

### Gas Cost Estimates

Typical deployment costs (estimates):
- Contract deployment: ~X USDC
- Register app: ~Y USDC
- Update app: ~Y USDC
- Rate app: ~Z USDC

*Actual costs may vary based on network congestion*
