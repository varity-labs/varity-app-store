# Get Started - Varity App Registry Deployment

Welcome! This guide will get you from zero to deployed in minutes.

## What You're Deploying

The **Varity App Registry** is a Stylus smart contract that powers the decentralized app store for Varity OS. It manages app listings, ratings, downloads, and developer verification on Varity L3 (Arbitrum Orbit).

## Before You Start

You need:
1. A computer with internet access
2. 10-15 minutes of time
3. A wallet with some USDC on Varity L3

That's it! The scripts will help you with the rest.

## Step 1: Verify Your Setup

Run the setup verification script:

```bash
./scripts/verify-setup.sh
```

This checks:
- Rust toolchain installation
- Required tools (cargo-stylus)
- All deployment scripts
- Network connectivity
- Build configuration

If it shows "READY TO DEPLOY", continue to Step 2.

If it shows errors, follow the fix instructions provided.

## Step 2: Configure Environment

Copy the environment template:

```bash
cp .env.example .env
```

Edit `.env` and add your private key:

```env
PRIVATE_KEY=your_actual_private_key_here
```

**IMPORTANT**: Never commit this file or share it publicly!

## Step 3: Choose Your Deployment Method

### Option A: Quick Deploy (Recommended for First Time)

```bash
make deploy PRIVATE_KEY=your_private_key_here
```

Fast, simple, one command. Perfect for testing.

### Option B: Full Pipeline (Recommended for Production)

```bash
PRIVATE_KEY=your_private_key_here ./scripts/deploy-and-verify.sh
```

This runs the complete deployment pipeline:
- Build contract
- Check compatibility
- Deploy to network
- Verify deployment
- Export ABI
- Update frontend config
- Run tests

### Option C: Manual Control

```bash
# 1. Build
cargo build --release --target wasm32-unknown-unknown

# 2. Check
cargo stylus check --endpoint https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz

# 3. Deploy
cargo stylus deploy \
  --endpoint https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz \
  --private-key $PRIVATE_KEY
```

Full control over each step.

## Step 4: Save Contract Address

After deployment, you'll see:

```
deployed code at address: 0x1234567890123456789012345678901234567890
```

**SAVE THIS ADDRESS!** You'll need it for:
- Frontend integration
- Contract verification
- Monitoring

## Step 5: Verify Deployment

Check your contract on the explorer:

```
https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz/address/0x...
```

Or run the verification script:

```bash
make verify CONTRACT_ADDRESS=0x...
```

## Step 6: Update Frontend

The full pipeline (Option B) does this automatically, but if you used Option A or C:

```bash
# Run post-deployment setup
./scripts/post-deploy.sh 0x...
```

This:
- Creates deployment record
- Exports ABI
- Updates frontend .env
- Copies ABI to frontend
- Runs verification tests

## What's Next?

### Monitor Your Contract

```bash
./scripts/monitor-deployment.sh 0x...
```

Real-time monitoring of contract activity.

### Test Integration

1. Start frontend: `cd ../frontend && npm run dev`
2. Register first app
3. Test all features
4. Verify events on explorer

### Share with Team

Share the deployment record:
```bash
cat deployment_*.json
```

Contains all deployment info.

## Need Help?

### Quick Questions

- **"Where's my contract address?"** - Check deployment output or explorer
- **"Deployment failed?"** - See [Troubleshooting](#troubleshooting)
- **"How do I update frontend?"** - Run `./scripts/post-deploy.sh 0x...`
- **"Can I deploy again?"** - Yes, but you'll get a new contract address

### Documentation

- **Quick deploy**: [QUICKSTART.md](QUICKSTART.md)
- **Full guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Contract docs**: [README.md](README.md)
- **File index**: [INDEX.md](INDEX.md)

### Troubleshooting

**"Insufficient funds"**
```bash
# Bridge USDC to Varity L3
# Check balance on explorer
```

**"wasm32-unknown-unknown not installed"**
```bash
rustup target add wasm32-unknown-unknown
```

**"cargo-stylus not found"**
```bash
cargo install cargo-stylus
```

**"Contract size too large"**
```bash
# Already optimized in Cargo.toml
# If still too large, review code
```

**"Transaction failed"**
```bash
# Check gas price: ./scripts/check-gas-price.sh
# Wait and retry
# Check network status
```

## Complete Command Reference

### Setup
```bash
./scripts/verify-setup.sh    # Verify environment
cp .env.example .env          # Create config
make install                  # Install dependencies
```

### Deploy
```bash
make deploy PRIVATE_KEY=xxx                       # Quick deploy
PRIVATE_KEY=xxx ./scripts/deploy-and-verify.sh   # Full pipeline
./deploy.sh                                       # Basic deploy
```

### Verify
```bash
make verify CONTRACT_ADDRESS=0x...          # Verify deployment
CONTRACT_ADDRESS=0x... ./test-deployment.sh # Test deployment
./scripts/post-deploy.sh 0x...              # Post-deploy setup
```

### Monitor
```bash
./scripts/monitor-deployment.sh 0x...  # Monitor contract
./scripts/check-gas-price.sh           # Check gas price
```

### Utilities
```bash
make export-abi          # Export ABI
make build              # Build contract
make test               # Run tests
make clean              # Clean artifacts
make info               # Show network info
make help               # Show all commands
```

## Deployment Checklist

Before deploying:
- [ ] Rust toolchain installed
- [ ] cargo-stylus installed
- [ ] wasm32 target added
- [ ] .env configured with private key
- [ ] Wallet has USDC for gas
- [ ] Scripts are executable
- [ ] Network connectivity verified

After deploying:
- [ ] Contract address saved
- [ ] Verified on explorer
- [ ] ABI exported
- [ ] Frontend config updated
- [ ] Deployment record created
- [ ] Team notified
- [ ] Integration tested

## Network Details

**Varity L3 Testnet**
- Name: Varity L3 Testnet
- RPC: https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz
- Chain ID: 33529
- Explorer: https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz
- Gas Token: USDC (6 decimals)

## Example Deployment

Here's what a successful deployment looks like:

```bash
$ PRIVATE_KEY=xxx ./scripts/deploy-and-verify.sh

==========================================
Varity App Registry - Full Deployment
==========================================

[1/6] Building contract...
   Compiling varity-app-registry v0.1.0
    Finished release [optimized] target(s) in 2.34s

[2/6] Checking Stylus compatibility...
Contract size: 45.2 KB
✓ Compatible with Stylus

[3/6] Deploying to Varity L3...
Sending transaction...
Transaction hash: 0xabc123...
Waiting for confirmation...
✓ Confirmed
deployed code at address: 0x1234567890123456789012345678901234567890

[4/6] Verifying deployment...
✓ Contract exists on-chain
✓ Explorer: https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz/address/0x...
✓ Verification complete

[5/6] Exporting ABI...
✓ ABI exported to abi/VarityAppRegistry.json

[6/6] Running post-deployment setup...
✓ Deployment record created
✓ Frontend config updated
✓ ABI copied to frontend
✓ Tests passed

==========================================
Deployment Successful!
==========================================

Contract Address: 0x1234567890123456789012345678901234567890
Explorer: https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz/address/0x...

All done! Contract is ready to use.
```

## What Happens During Deployment?

1. **Build**: Contract compiled to WASM
2. **Check**: Verified Stylus compatibility
3. **Deploy**: Sent to Varity L3 network
4. **Confirm**: Waited for block confirmation
5. **Verify**: Checked on-chain presence
6. **Export**: Generated ABI for frontend
7. **Configure**: Updated environment files
8. **Test**: Ran verification tests

## Security Reminders

- Never commit `.env` file
- Never share private keys
- Use test wallet for testnet
- Use hardware wallet for mainnet
- Verify contract address before sharing
- Keep deployment records safe
- Monitor contract activity

## Ready to Deploy?

1. **Verify setup**: `./scripts/verify-setup.sh`
2. **Configure**: Edit `.env` file
3. **Deploy**: Choose method above
4. **Verify**: Check explorer
5. **Integrate**: Update frontend
6. **Test**: Try all features
7. **Share**: Notify team

## Success!

Once deployed, your contract is live on Varity L3!

Next steps:
- Test contract in frontend
- Register first app
- Share with community
- Monitor activity
- Plan for mainnet

Welcome to Varity OS development!

---

**Questions?** Check [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive guide or [INDEX.md](INDEX.md) for all documentation.

**Ready to deploy?** Run `./scripts/verify-setup.sh` to start!
