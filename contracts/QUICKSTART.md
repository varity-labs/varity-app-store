# Quick Start - Deploy in 5 Minutes

Fast track guide to deploy Varity App Registry contract.

## Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown

# Install Cargo Stylus
cargo install cargo-stylus
```

## Deploy Now

```bash
# 1. Navigate to contracts
cd varity-app-store/contracts

# 2. Setup environment
cp .env.example .env
# Edit .env and add your PRIVATE_KEY

# 3. Deploy
chmod +x deploy.sh
export PRIVATE_KEY="your_private_key_here"
./deploy.sh
```

## Or Use Makefile

```bash
# Install dependencies
make install

# Build and deploy
make deploy PRIVATE_KEY=your_private_key_here
```

## Save Contract Address

After deployment, you'll see:
```
deployed code at address: 0x1234567890123456789012345678901234567890
```

**Save this address!** You need it for:
1. Frontend integration
2. Backend configuration
3. Contract verification

## Next Steps

1. **Update Frontend**
   ```bash
   # varity-app-store/frontend/.env.local
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
   ```

2. **Verify on Explorer**
   ```
   https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz/address/0x...
   ```

3. **Test Contract**
   ```bash
   make verify CONTRACT_ADDRESS=0x...
   ```

## Need Help?

- Read full guide: `DEPLOYMENT.md`
- Check README: `README.md`
- Troubleshooting: `DEPLOYMENT.md#troubleshooting`

## Network Info

- **RPC**: https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz
- **Chain ID**: 33529
- **Explorer**: https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz
- **Gas Token**: USDC (6 decimals)

## Common Issues

**"Insufficient funds"**
- Bridge USDC to Varity L3

**"wasm32-unknown-unknown not installed"**
```bash
rustup target add wasm32-unknown-unknown
```

**"cargo-stylus not found"**
```bash
cargo install cargo-stylus
```

That's it! You're deployed.
