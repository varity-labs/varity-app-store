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

### Current (MVP Launch Ready ✅)
- ✅ Browse all approved apps
- ✅ Category browsing page with statistics
- ✅ Search functionality (search by name or description)
- ✅ Category filtering on browse page
- ✅ Network/chain filtering
- ✅ Help center with comprehensive FAQ
- ✅ App detail pages with full information
- ✅ Zero-crypto UX (no wallet buttons, no crypto terminology)
- ✅ Comprehensive SEO optimization (meta tags, structured data)
- ✅ Sitemap.xml and robots.txt for search engines
- ✅ Mobile responsive design (mobile, tablet, desktop)
- ✅ Static export for IPFS deployment (108 pages)
- ✅ No authentication required for browsing
- ✅ Professional Apple App Store-style UX

### Planned (Post-MVP)
- 🔲 User reviews and ratings
- 🔲 Featured apps section
- 🔲 Popular apps ranking
- 🔲 Advanced analytics dashboard

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
NEXT_PUBLIC_CONTRACT_ADDRESS=0x52d4f28ebe20fad743bbef9daa61bfe3ce91eb74
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
- **Address:** `0x52d4f28ebe20fad743bbef9daa61bfe3ce91eb74`
- **Explorer:** [View on Explorer](https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz/address/0x52d4f28ebe20fad743bbef9daa61bfe3ce91eb74)

---

## 🤝 Contributing

This is the **user-facing portal** for Varity App Store. For developer features (app submissions, dashboard, admin panel), contribute to the developer portal repository (to be created).

---

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ by the Varity team**

---

**Last updated**: January 22, 2026 - MVP Launch Ready ✅
