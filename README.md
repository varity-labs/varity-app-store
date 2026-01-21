# Varity App Store

The official decentralized application marketplace for the Varity ecosystem. Built with Next.js, Privy authentication, and Arbitrum Stylus smart contracts.

## Overview

The Varity App Store enables developers to:
- Submit and list applications built on Varity
- Discover and browse Web3 applications
- Review and approve applications (admin only)
- Track application submissions and status

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Privy** - Web3 authentication (email, social, wallet)
- **thirdweb v5** - Smart contract interactions

### Smart Contracts
- **Arbitrum Stylus** - Rust-based smart contracts (WASM)
- **Varity L3** - Arbitrum Orbit rollup testnet

## Quick Start

### Prerequisites

- Node.js 20.9.0+
- Rust 1.92.0+
- cargo-stylus 0.10.0+

### Frontend Setup

```bash
cd frontend
npm install

# Copy environment file and add your credentials
cp .env.example .env.local
# Edit .env.local with your Privy App ID and thirdweb Client ID

# Run development server
npm run dev
# Visit http://localhost:3000
```

### Smart Contract Deployment

```bash
cd contracts

# Copy environment file and add your private key
cp .env.example .env
# Edit .env with your private key (never commit this file!)

# Build the contract
cargo build --release --target wasm32-unknown-unknown

# Deploy to Varity L3 testnet
export $(grep -v '^#' .env | xargs)
cargo stylus deploy \
  --endpoint $VARITY_L3_RPC \
  --private-key $PRIVATE_KEY \
  --no-verify
```

## Environment Variables

### Frontend (.env.local or .env.production)

```bash
# Privy Authentication - Get from https://dashboard.privy.io
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# thirdweb Client ID - Get from https://thirdweb.com/dashboard
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id

# Contract Address (after deployment)
NEXT_PUBLIC_VARITY_REGISTRY_ADDRESS=0x...
```

### Contracts (.env - NEVER commit this file!)

```bash
# Your wallet private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Network configuration
VARITY_L3_RPC=https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz
VARITY_L3_CHAIN_ID=33529
```

## Deployment

### 4everland (Production)

The Varity App Store is hosted on 4everland at **store.varity.so**.

**Deploy steps:**
1. Push code to GitHub (public repository)
2. Import project to 4everland
3. Configure environment variables in 4everland dashboard
4. Set custom domain: store.varity.so
5. Add store.varity.so to Privy dashboard allowed origins

**Build configuration:**
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/.next`
- Install Command: `npm install`

## Network Configuration

### Varity L3 Testnet
- **Chain ID:** 33529
- **RPC:** https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz
- **Explorer:** https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz
- **Native Token:** Bridged USDC (6 decimals)

## Smart Contract

### Deployed Contract
- **Network:** Varity L3 Testnet
- **Address:** `0x3faa42a8639fcb076160d553e8d6e05add7d97a5`
- **Explorer:** [View on Explorer](https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz/address/0x3faa42a8639fcb076160d553e8d6e05add7d97a5)

### Contract Functions
- `register_app()` - Submit a new application
- `approve_app()` - Approve application (admin only)
- `get_app()` - Fetch application details
- `get_all_apps()` - List all approved applications

## Project Structure

```
varity-app-store/
├── frontend/           # Next.js application
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/ # React components
│   │   ├── hooks/     # Custom hooks (auth, contracts)
│   │   └── lib/       # Utilities and constants
│   ├── public/        # Static assets
│   └── package.json
│
├── contracts/         # Stylus smart contracts (Rust)
│   ├── src/
│   │   └── lib.rs    # VarityAppRegistry contract
│   ├── Cargo.toml
│   └── deploy-simple.sh
│
└── README.md
```

## Security

**CRITICAL:** Never commit files containing private keys or secrets:
- ❌ `contracts/.env` - Contains private key
- ❌ `frontend/.env.local` - Local development credentials
- ✅ `frontend/.env.production` - Safe to commit (public IDs only)
- ✅ `.env.example` files - Safe to commit (no actual values)

## Development Status

**Current Phase:** MVP Development
- ✅ Smart contract deployed to Varity L3
- ✅ Frontend UI redesigned (matches Varity brand)
- ✅ Authentication with Privy
- ✅ Mock data removed (ready for contract integration)
- 🚧 Contract integration (in progress)
- 🚧 Admin approval workflow
- 🚧 Production deployment to store.varity.so

## Contributing

This is a public repository for the Varity ecosystem. Contributions welcome!

## License

MIT License - See LICENSE file for details

## Links

- **Live Site:** https://store.varity.so (coming soon)
- **Varity Website:** https://varity.so
- **Documentation:** https://docs.varity.so
- **Discord:** https://discord.gg/varity

---

Built with ❤️ by the Varity team
# Trigger redeploy
