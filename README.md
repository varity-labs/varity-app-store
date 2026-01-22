# Varity App Store - User Portal

**Live Site**: https://store.varity.so
**Purpose**: Consumer-facing marketplace for discovering decentralized applications
**Target Audience**: End users looking for apps to solve their problems

---

## 🎯 Zero-Crypto UX Philosophy

This portal is designed with **ZERO crypto terminology** visible to users:
- ❌ No "Connect Wallet" buttons
- ❌ No crypto jargon (Web3, blockchain, L3, etc.)
- ❌ No wallet addresses or transaction UI
- ✅ Clean, consumer-friendly browsing experience
- ✅ Feels like Apple App Store / Google Play

Users simply browse, discover, and launch apps. The apps themselves handle authentication via embedded wallets (Privy), so users never see seed phrases or wallet UI.

---

## 📁 Repository Structure

```
varity-app-store/           # USER PORTAL (this repo)
├── src/
│   ├── app/
│   │   ├── page.tsx              # Browse apps homepage
│   │   └── app/[id]/page.tsx     # App detail pages
│   ├── components/
│   │   ├── Header.tsx            # Simple nav (Browse | Categories)
│   │   ├── Footer.tsx            # Consumer-friendly footer
│   │   ├── AppCard.tsx           # App listing cards
│   │   └── ...
│   ├── hooks/
│   │   └── useContract.ts        # Read-only contract access
│   └── lib/
│       ├── constants.ts
│       └── utils.ts
├── public/
│   ├── logo/
│   └── fonts/
├── package.json
├── next.config.ts
└── README.md
```

**Separate Repository**:
Developer portal (app submissions, dashboard, admin) will live at:
👉 `varity-app-store-developer` (to be created)

---

## 🚀 Development

### Prerequisites
- Node.js 20+
- npm or pnpm

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
# Opens on http://localhost:3000
```

### Build for Production
```bash
npm run build
# Generates static export in /out directory
```

---

## 📋 Features

### Current (MVP)
- ✅ Browse all approved apps
- ✅ App detail pages with full information
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Static export for IPFS deployment
- ✅ No authentication required (browse-only)
- ✅ Professional Apple App Store-style UX

### Planned (Post-MVP)
- 🔲 Category filtering (DeFi, Gaming, Social, etc.)
- 🔲 Search functionality
- 🔲 User reviews and ratings
- 🔲 Featured apps section
- 🔲 Popular apps ranking

---

## 🌐 Deployment

### 4everland (Current)
This repo deploys to **store.varity.so** via 4everland.

**Settings**:
```
Repository: varity-labs/varity-app-store
Root Directory: /
Build Command: (auto-detected Next.js)
Output Directory: out
Domain: store.varity.so
```

**Environment Variables**:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x3faa42a8639fcb076160d553e8d6e05add7d97a5
NEXT_PUBLIC_CHAIN_ID=33529
NEXT_PUBLIC_PRIVY_APP_ID=cm6f5z5og0g91t0pbulwvf5o2
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=6e3f891a9c88e09a5d02eb71b7cd2cc9
```

---

## 🔗 Related Repositories

- **Developer Portal**: `varity-app-store-developer` (to be created)
- **Smart Contracts**: Included in `contracts/` directory (Arbitrum Stylus)
- **Varity SDK**: https://github.com/varity-labs/varity-sdk

---

## 📖 Smart Contract

### Deployed Contract
- **Network:** Varity L3 Testnet
- **Chain ID:** 33529
- **Address:** `0x3faa42a8639fcb076160d553e8d6e05add7d97a5`
- **Explorer:** [View on Explorer](https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz/address/0x3faa42a8639fcb076160d553e8d6e05add7d97a5)

---

## 🤝 Contributing

This is the **user-facing portal** for Varity App Store. For developer features (app submissions, dashboard, admin panel), contribute to the developer portal repository (to be created).

---

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ by the Varity team**
