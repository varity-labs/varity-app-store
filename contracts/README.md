# Varity App Registry - Smart Contract

Stylus smart contract for managing decentralized app registry on Varity L3.

## Overview

This contract provides on-chain registry for Varity apps with:
- App registration and metadata storage
- Category-based organization
- Developer verification
- Download tracking
- Rating system

## Technology Stack

- **Language**: Rust
- **Framework**: Arbitrum Stylus SDK v0.10
- **Network**: Varity L3 (Arbitrum Orbit)
- **Chain ID**: 33529

## Prerequisites

1. **Rust Toolchain**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   rustup target add wasm32-unknown-unknown
   ```

2. **Cargo Stylus CLI**
   ```bash
   cargo install cargo-stylus
   ```

3. **Wallet with USDC**
   - Bridge USDC to Varity L3 for gas fees
   - Get testnet USDC from faucet (if available)

## Setup

1. **Clone and Install Dependencies**
   ```bash
   cd varity-app-store/contracts
   cargo build
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your PRIVATE_KEY
   ```

3. **Verify Setup**
   ```bash
   cargo stylus check --endpoint https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz
   ```

## Build & Test

### Build Contract
```bash
cargo build --release --target wasm32-unknown-unknown
```

### Run Tests
```bash
cargo test
```

### Export ABI
```bash
cargo stylus export-abi
```

## Deployment

### Deploy to Varity L3 Testnet

1. **Set Private Key**
   ```bash
   export PRIVATE_KEY="your_private_key_here"
   ```

2. **Run Deployment Script**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **Or Deploy Manually**
   ```bash
   cargo stylus deploy \
     --endpoint https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz \
     --private-key $PRIVATE_KEY
   ```

### Deployment Output

After successful deployment, you'll see:
```
deployed code at address: 0x...
```

**Save this address** - you'll need it for frontend integration.

## Verify Deployment

1. **Check on Explorer**
   ```
   https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz/address/0x...
   ```

2. **Test Contract Interaction**
   ```bash
   # Test read functions
   cargo stylus replay \
     --endpoint https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz \
     --contract 0x... \
     # Add call data
   ```

## Contract Structure

### Main Components

```
src/
├── lib.rs           # Contract entry point
├── app_registry.rs  # Core registry logic
├── types.rs         # Data structures (AppMetadata, Category, etc.)
└── events.rs        # Event definitions
```

### Key Functions

**Registration**
- `register_app(metadata: AppMetadata)` - Register new app
- `update_app(app_id: U256, metadata: AppMetadata)` - Update app info
- `remove_app(app_id: U256)` - Remove app (owner only)

**Query**
- `get_app(app_id: U256)` - Get app details
- `get_apps_by_category(category: Category)` - Filter by category
- `get_apps_by_developer(developer: Address)` - Filter by developer
- `get_total_apps()` - Get total app count

**Interactions**
- `increment_downloads(app_id: U256)` - Track download
- `rate_app(app_id: U256, rating: u8)` - Submit rating
- `verify_developer(developer: Address)` - Admin verification

## Integration with Frontend

After deployment, update frontend environment:

```env
# varity-app-store/frontend/.env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=33529
NEXT_PUBLIC_RPC_URL=https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz
```

## Gas Optimization

The contract is optimized for low gas usage:
- `opt-level = "s"` - Size optimization
- `lto = true` - Link-time optimization
- `codegen-units = 1` - Single codegen unit
- `strip = true` - Strip symbols

## Security Considerations

1. **Private Key Security**
   - Never commit `.env` file
   - Use environment variables in production
   - Consider using hardware wallet for mainnet

2. **Access Control**
   - Only contract owner can verify developers
   - Only app owner can update/remove their apps
   - Rate limiting on sensitive functions

3. **Input Validation**
   - App metadata validated before storage
   - Ratings bounded (1-5 stars)
   - Address validation for developers

## Network Information

**Varity L3 Testnet**
- RPC: https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz
- Chain ID: 33529
- Explorer: https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz
- Native Token: Bridged USDC (6 decimals)
- Bridge: [Add bridge URL when available]

## Troubleshooting

### Build Errors

**Error: "wasm32-unknown-unknown not installed"**
```bash
rustup target add wasm32-unknown-unknown
```

**Error: "cargo-stylus not found"**
```bash
cargo install cargo-stylus
```

### Deployment Errors

**Error: "Insufficient funds"**
- Bridge USDC to Varity L3 for gas fees

**Error: "Invalid private key"**
- Ensure PRIVATE_KEY in .env is valid hex (64 characters)
- Don't include "0x" prefix

**Error: "RPC connection failed"**
- Check RPC endpoint is accessible
- Verify network is not down

### Contract Interaction Errors

**Error: "Contract not found"**
- Verify contract address is correct
- Check deployment was successful

**Error: "Function reverted"**
- Check function inputs are valid
- Verify you have necessary permissions

## Development Workflow

1. **Make Changes**
   ```bash
   # Edit src/ files
   cargo build
   cargo test
   ```

2. **Test Locally**
   ```bash
   # Run unit tests
   cargo test

   # Test WASM build
   cargo build --release --target wasm32-unknown-unknown
   ```

3. **Deploy to Testnet**
   ```bash
   ./deploy.sh
   ```

4. **Verify on Explorer**
   - Check contract code
   - Test transactions
   - Monitor events

5. **Update Frontend**
   - Update contract address
   - Test integration
   - Deploy frontend

## Upgrading Contract

Stylus contracts are immutable. To upgrade:

1. Deploy new contract version
2. Migrate data if needed
3. Update frontend to new address
4. Deprecate old contract gracefully

## Resources

- [Arbitrum Stylus Docs](https://docs.arbitrum.io/stylus/stylus-gentle-introduction)
- [Stylus SDK Reference](https://docs.rs/stylus-sdk/latest/stylus_sdk/)
- [Varity L3 Explorer](https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz)
- [Varity Documentation](../../varity-sdk/docs/)

## Support

For issues or questions:
- GitHub Issues: [Add repo URL]
- Documentation: `varity-internal/architecture/`
- Varity Discord: [Add link]

## License

MIT License - See LICENSE file for details
