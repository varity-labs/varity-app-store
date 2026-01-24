# 4everland Deployment Guide - Dual Portal Setup

**Last Updated**: January 21, 2026
**Repository**: varity-labs/varity-app-store (monorepo)
**Portals**: User (store.varity.so) + Developer (developer.varity.so)

---

## 🎯 Architecture

**Single GitHub Repository, Two 4everland Projects**

```
GitHub: varity-labs/varity-app-store
├── frontend-user/           → Deploys to store.varity.so
├── frontend-developer/      → Deploys to developer.varity.so
└── frontend/                → Original (can delete after migration)
```

---

## 📋 Step-by-Step Setup

### Step 1: Create First 4everland Project (User Portal)

1. Go to https://dashboard.4everland.org/
2. Click "New Project"
3. Select "Import from GitHub"
4. Choose repository: `varity-labs/varity-app-store`
5. Configure project:

```
Project Name: varity-app-store-user
Branch: main

Framework Preset: Next.js
Root Directory: /                     (leave as root)
Build Command: cd frontend-user && npm install && npm run build
Output Directory: frontend-user/out

Environment Variables:
  NEXT_PUBLIC_CONTRACT_ADDRESS=0x52d4f28ebe20fad743bbef9daa61bfe3ce91eb74
  NEXT_PUBLIC_CHAIN_ID=33529
  NEXT_PUBLIC_PRIVY_APP_ID=cm6f5z5og0g91t0pbulwvf5o2
  NEXT_PUBLIC_THIRDWEB_CLIENT_ID=6e3f891a9c88e09a5d02eb71b7cd2cc9
```

6. Click "Deploy"
7. Wait for deployment to complete
8. Go to "Settings" → "Domains"
9. Add custom domain: `store.varity.so`
10. Configure DNS (see DNS Configuration section below)

---

### Step 2: Create Second 4everland Project (Developer Portal)

1. Go to https://dashboard.4everland.org/
2. Click "New Project"
3. Select "Import from GitHub"
4. Choose repository: `varity-labs/varity-app-store` (same repo!)
5. Configure project:

```
Project Name: varity-app-store-developer
Branch: main

Framework Preset: Next.js
Root Directory: /                     (leave as root)
Build Command: cd frontend-developer && npm install && npm run build
Output Directory: frontend-developer/out

Environment Variables:
  NEXT_PUBLIC_CONTRACT_ADDRESS=0x52d4f28ebe20fad743bbef9daa61bfe3ce91eb74
  NEXT_PUBLIC_CHAIN_ID=33529
  NEXT_PUBLIC_PRIVY_APP_ID=cm6f5z5og0g91t0pbulwvf5o2
  NEXT_PUBLIC_THIRDWEB_CLIENT_ID=6e3f891a9c88e09a5d02eb71b7cd2cc9
  WEB3FORMS_ACCESS_KEY=322fcdfe-779a-4cab-a76a-11285466709c
```

6. Click "Deploy"
7. Wait for deployment to complete
8. Go to "Settings" → "Domains"
9. Add custom domain: `developer.varity.so`
10. Configure DNS (see DNS Configuration section below)

---

## 🌐 DNS Configuration

**Where**: Cloudflare (or wherever varity.so DNS is managed)

**Add these CNAME records**:

```
Type: CNAME
Name: store
Target: [4everland-user-project-url].4everland.link
TTL: Auto
Proxy: Yes (orange cloud)

Type: CNAME
Name: developer
Target: [4everland-developer-project-url].4everland.link
TTL: Auto
Proxy: Yes (orange cloud)
```

**Example**:
```
store.varity.so      → CNAME → varity-app-store-user-abc123.4everland.link
developer.varity.so  → CNAME → varity-app-store-developer-xyz789.4everland.link
```

**Verification**:
```bash
# Check DNS propagation
dig store.varity.so
dig developer.varity.so

# Should show CNAME pointing to 4everland
```

---

## 🔄 Auto-Deploy Setup

**Both projects** will auto-deploy when you push to `main` branch.

**Important**:
- Pushing to main triggers BOTH projects to rebuild
- This is fine because builds are fast (~2-3 minutes each)
- If you only changed frontend-user/, frontend-developer/ still rebuilds (but should succeed since no changes)

**To deploy manually**:
1. Go to 4everland project dashboard
2. Click "Deployments" tab
3. Click "Redeploy" on latest deployment
4. Or: Push to GitHub main branch

---

## 🧪 Testing Deployments

### Local Testing (Before Deployment)

**User Portal**:
```bash
cd /home/macoding/varity-workspace/varity-app-store/frontend-user
npm install
npm run dev
# Opens on http://localhost:3000
```

**Developer Portal**:
```bash
cd /home/macoding/varity-workspace/varity-app-store/frontend-developer
npm install
npm run dev
# Opens on http://localhost:3000
```

**Production Build Test**:
```bash
# User portal
cd frontend-user
npm run build  # Should complete without errors

# Developer portal
cd frontend-developer
npm run build  # Should complete without errors
```

### Live Testing (After Deployment)

**User Portal**:
- Visit: https://store.varity.so
- Should see: Browse page, no wallet UI, no crypto terminology
- Test: Click app → Should navigate to /app/[id]
- Test: Click "Open Application" → Should redirect to app URL

**Developer Portal**:
- Visit: https://developer.varity.so
- Should see: Developer landing page, "Sign In" button
- Test: Click "Sign In" → Privy modal opens
- Test: Sign in with email → Dashboard accessible
- Test: Navigate to /submit → Form loads
- Test: Submit app → Web3Forms email sent + Smart contract called

---

## 📝 Build Commands Explained

### User Portal Build Command
```bash
cd frontend-user && npm install && npm run build
```

**Breakdown**:
1. `cd frontend-user` - Navigate to user portal directory
2. `npm install` - Install dependencies (Next.js, React, etc.)
3. `npm run build` - Run Next.js static export
   - Generates HTML files in `out/` directory
   - 108 pages pre-rendered (including 100 app detail pages)

### Developer Portal Build Command
```bash
cd frontend-developer && npm install && npm run build
```

**Same process**, just in different directory.

---

## 🐛 Troubleshooting

### Build Fails: "Module not found"

**Cause**: Missing dependencies after split

**Fix**:
```bash
# Ensure both portals have all dependencies
cd frontend-user
npm install

cd ../frontend-developer
npm install
```

### Build Fails: "generateStaticParams required"

**Cause**: Dynamic routes need static params for export

**Fix**: Already handled in `/frontend-user/src/app/app/[id]/layout.tsx`
```typescript
export async function generateStaticParams() {
  return Array.from({ length: 100 }, (_, i) => ({ id: String(i + 1) }));
}
```

### Build Succeeds But Site Shows 404

**Cause**: DNS not configured or not propagated

**Fix**:
1. Check DNS records in Cloudflare
2. Wait 5-10 minutes for propagation
3. Clear browser cache
4. Try incognito window

### "Connect Wallet" Still Showing on User Portal

**Cause**: Old build cached, or wrong project deployed

**Fix**:
1. Verify 4everland is building from `frontend-user/` directory
2. Check "Build Command" in 4everland settings
3. Trigger manual redeploy
4. Clear browser cache + hard refresh (Cmd+Shift+R)

### Environment Variables Not Working

**Cause**: Not set in 4everland project settings

**Fix**:
1. Go to 4everland project → Settings → Environment Variables
2. Add all required variables (see Step 1 & 2 above)
3. Trigger redeploy (env changes require redeploy)

---

## 🔒 Environment Variables Reference

### Required for Both Portals

```env
# Smart Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=0x52d4f28ebe20fad743bbef9daa61bfe3ce91eb74

# Varity L3 Network
NEXT_PUBLIC_CHAIN_ID=33529

# Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID=cm6f5z5og0g91t0pbulwvf5o2

# thirdweb SDK
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=6e3f891a9c88e09a5d02eb71b7cd2cc9
```

### Developer Portal Only

```env
# Web3Forms (for submission notifications)
WEB3FORMS_ACCESS_KEY=322fcdfe-779a-4cab-a76a-11285466709c
```

### Optional (Analytics, Monitoring)

```env
# Google Analytics (if needed)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry Error Tracking (if needed)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## 📊 Deployment Checklist

### Pre-Deployment

- [x] Split frontend into frontend-user and frontend-developer
- [x] Remove wallet UI from user portal
- [x] Update package.json names
- [x] Test builds locally (both should succeed)
- [ ] Create developer landing page
- [ ] Integrate Web3Forms
- [ ] Commit all changes to GitHub

### 4everland Setup

- [ ] Create user portal project (store.varity.so)
- [ ] Create developer portal project (developer.varity.so)
- [ ] Configure build commands for both
- [ ] Add environment variables to both
- [ ] Test deployments (trigger manual build)

### DNS Configuration

- [ ] Add CNAME for store.varity.so
- [ ] Add CNAME for developer.varity.so
- [ ] Verify DNS propagation
- [ ] Test custom domains load correctly

### Post-Deployment Testing

- [ ] User portal: Browse apps (no wallet UI visible)
- [ ] User portal: Click app → Detail page loads
- [ ] Developer portal: Landing page loads
- [ ] Developer portal: Sign in works (Privy)
- [ ] Developer portal: Submit form works (Web3Forms + contract)
- [ ] Developer portal: Dashboard shows user's apps
- [ ] Admin portal: Can approve apps

### Contract Initialization

- [ ] Navigate to developer.varity.so/admin/initialize
- [ ] Connect admin wallet
- [ ] Call initialize() function
- [ ] Verify admin controls work (approve/reject apps)

---

## 🚀 Quick Deploy Commands

```bash
# From varity-app-store root directory

# Build user portal locally
cd frontend-user && npm run build && cd ..

# Build developer portal locally
cd frontend-developer && npm run build && cd ..

# Commit and push to trigger auto-deploy
git add frontend-user/ frontend-developer/
git commit -m "Deploy dual portals: user + developer separation"
git push origin main

# 4everland will auto-deploy both projects within 2-3 minutes
```

---

## 📈 Monitoring Deployments

### 4everland Dashboard

**User Portal**:
- URL: https://dashboard.4everland.org/[user-project-id]
- Check: Build logs, deployment status, analytics

**Developer Portal**:
- URL: https://dashboard.4everland.org/[developer-project-id]
- Check: Build logs, deployment status, analytics

### Build Success Indicators

**User Portal Build Log** should show:
```
✓ Generating static pages (108)
  ├ ○ / (static)
  ├ ● /app/[id] (SSG)
  │   ├ /app/1
  │   ├ /app/2
  │   └ [+98 more paths]

Route (app)
○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML

Build completed successfully
```

**Developer Portal Build Log** should show similar output.

---

## 🔄 Future: Shared Components

Once both portals are stable, extract shared code:

```
varity-app-store/
├── frontend-user/
├── frontend-developer/
└── shared/                    # NEW: Shared code
    ├── components/
    │   ├── AppCard.tsx        # Used by both portals
    │   ├── Badge.tsx
    │   └── Providers.tsx
    ├── hooks/
    │   └── useContract.ts
    ├── lib/
    │   ├── constants.ts
    │   ├── utils.ts
    │   └── types.ts
    └── styles/
        └── globals.css
```

**Update imports**:
```typescript
// Before (duplicated code)
import { AppCard } from '@/components/AppCard';

// After (shared code)
import { AppCard } from '../../../shared/components/AppCard';
```

**Or use npm workspaces** (package.json in root):
```json
{
  "name": "varity-app-store",
  "private": true,
  "workspaces": [
    "frontend-user",
    "frontend-developer",
    "shared"
  ]
}
```

Then import as:
```typescript
import { AppCard } from '@varity/shared/components/AppCard';
```

---

## ✅ Success Criteria

**User Portal (store.varity.so)**:
- ✅ Loads without errors
- ✅ No wallet UI visible
- ✅ No crypto terminology
- ✅ Browse page shows apps
- ✅ App detail pages work
- ✅ "Open Application" redirects to app URL

**Developer Portal (developer.varity.so)**:
- ✅ Landing page loads (hero, benefits, CTA)
- ✅ "Sign In" works (Privy email/social)
- ✅ Submit form works (Web3Forms email + contract call)
- ✅ Dashboard shows developer's apps
- ✅ Admin panel accessible (after initialization)

**Auto-Deploy**:
- ✅ Git push triggers both deployments
- ✅ Builds complete in <5 minutes
- ✅ Changes reflect on live sites within 5 minutes

---

**Last Updated**: January 21, 2026
**Status**: Ready to deploy
**Next Steps**: Create 4everland projects, configure DNS, test deployments
