# Varity App Store - 4everland Deployment Guide

## Prerequisites

1. GitHub account
2. 4everland account (https://4everland.org)
3. Access to store.varity.so domain DNS settings

## Step 1: Push to GitHub

```bash
cd /home/macoding/varity-workspace/varity-app-store

# Review files to be committed
git status

# Commit all files
git commit -m "Initial commit - Varity App Store MVP

- Next.js 16 frontend with Privy auth
- Stylus smart contract deployed to Varity L3
- Contract address: 0x3faa42a8639fcb076160d553e8d6e05add7d97a5
- UI redesigned to match Varity brand
- Ready for contract integration"

# Create GitHub repository (public)
# Go to https://github.com/new
# Name: varity-app-store
# Description: Official decentralized app store for the Varity ecosystem
# Public repository
# Don't initialize with README (we have one)

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/varity-app-store.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to 4everland

1. **Login to 4everland**
   - Go to https://dashboard.4everland.org
   - Connect with GitHub

2. **Import Project**
   - Click "New Project"
   - Select "Import from GitHub"
   - Choose `varity-app-store` repository
   - Click "Import"

3. **Configure Build Settings**
   ```
   Framework: Next.js
   Root Directory: frontend
   Build Command: npm install && npm run build
   Output Directory: .next
   Install Command: npm install
   Node Version: 20.9.0
   ```

4. **Environment Variables**
   Add these in 4everland dashboard:
   ```
   NEXT_PUBLIC_PRIVY_APP_ID=cmhwbozxu004fjr0cicfz0tf8
   NEXT_PUBLIC_THIRDWEB_CLIENT_ID=acb17e07e34ab2b8317aa40cbb1b5e1d
   NEXT_PUBLIC_VARITY_REGISTRY_ADDRESS=0x3faa42a8639fcb076160d553e8d6e05add7d97a5
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - You'll get a default URL: `your-project.4everland.app`

## Step 3: Configure Custom Domain

1. **Add Domain in 4everland**
   - Go to Project Settings → Domains
   - Click "Add Domain"
   - Enter: `store.varity.so`
   - 4everland will provide DNS records

2. **Update DNS Records**
   Add these records in your domain provider (where varity.so is hosted):
   ```
   Type: CNAME
   Name: store
   Value: [provided by 4everland]
   TTL: 3600
   ```

3. **SSL Certificate**
   - 4everland automatically provisions SSL
   - Wait 5-10 minutes for DNS propagation
   - Your site will be live at https://store.varity.so

## Step 4: Update Privy Dashboard

1. Go to https://dashboard.privy.io
2. Select your app: `cmhwbozxu004fjr0cicfz0tf8`
3. Settings → Allowed Origins
4. Add: `https://store.varity.so`
5. Save changes

## Step 5: Verify Deployment

Visit https://store.varity.so and test:
- ✅ Site loads correctly
- ✅ Sign In button works (Privy modal opens)
- ✅ Browse page shows empty state (no apps yet)
- ✅ Submit page shows "Contract integration not yet implemented"
- ✅ Dashboard requires sign in
- ✅ Admin page requires sign in

## Troubleshooting

### Build Fails
- Check build logs in 4everland dashboard
- Verify `frontend/` directory structure
- Ensure all dependencies are in package.json

### Sign In Doesn't Work
- Verify Privy App ID is correct
- Check that store.varity.so is in Privy allowed origins
- Clear browser cache and try again

### Domain Not Working
- DNS propagation can take up to 48 hours (usually 5-10 minutes)
- Verify CNAME record is correct: `dig store.varity.so`
- Check 4everland domain status

### Environment Variables Not Working
- Environment variables must start with `NEXT_PUBLIC_` to be accessible in browser
- Redeploy after adding/changing environment variables
- Check deployment logs for errors

## Future Updates

To deploy updates:
```bash
git add -A
git commit -m "Description of changes"
git push origin main
```

4everland will automatically rebuild and deploy (usually takes 2-3 minutes).

## Rollback

If you need to rollback to a previous version:
1. Go to 4everland dashboard
2. Deployments tab
3. Find the working deployment
4. Click "Promote to Production"

---

**Next Steps After Deployment:**
1. Integrate contract reading (fetch apps from registry)
2. Implement app submission (write to contract)
3. Add admin approval workflow
4. Update Varity marketing website to link to store.varity.so
