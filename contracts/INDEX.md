# Varity App Registry - File Index

Quick reference guide to all deployment files and documentation.

## Documentation

| File | Description | Read First |
|------|-------------|------------|
| [README.md](README.md) | Complete contract documentation | Yes |
| [QUICKSTART.md](QUICKSTART.md) | 5-minute deployment guide | For quick deploy |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Comprehensive deployment guide | For production |
| [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) | Deployment infrastructure overview | For reference |
| [INDEX.md](INDEX.md) | This file - complete file index | Navigation |

## Deployment Scripts

### Core Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| [deploy.sh](deploy.sh) | Main deployment script | `PRIVATE_KEY=xxx ./deploy.sh` |
| [verify.sh](verify.sh) | Contract verification | `CONTRACT_ADDRESS=0x... ./verify.sh` |
| [export-abi.sh](export-abi.sh) | ABI export | `./export-abi.sh` |
| [test-deployment.sh](test-deployment.sh) | Deployment testing | `CONTRACT_ADDRESS=0x... ./test-deployment.sh` |

### Advanced Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| [scripts/deploy-and-verify.sh](scripts/deploy-and-verify.sh) | Full deployment pipeline | `PRIVATE_KEY=xxx ./scripts/deploy-and-verify.sh` |
| [scripts/post-deploy.sh](scripts/post-deploy.sh) | Post-deployment automation | `./scripts/post-deploy.sh 0x...` |
| [scripts/monitor-deployment.sh](scripts/monitor-deployment.sh) | Real-time monitoring | `./scripts/monitor-deployment.sh 0x...` |
| [scripts/check-gas-price.sh](scripts/check-gas-price.sh) | Gas price checker | `./scripts/check-gas-price.sh` |

## Configuration Files

| File | Purpose | Notes |
|------|---------|-------|
| [.env.example](.env.example) | Environment template | Copy to `.env` and configure |
| [deployment.config.json](deployment.config.json) | Deployment configuration | Network and contract settings |
| [.gitignore](.gitignore) | Git ignore rules | Protects sensitive files |
| [Cargo.toml](Cargo.toml) | Rust manifest | Dependencies and build config |
| [Makefile](Makefile) | Build automation | Type `make help` for targets |

## CI/CD

| File | Purpose | Notes |
|------|---------|-------|
| [.github/workflows/deploy.yml](.github/workflows/deploy.yml) | GitHub Actions workflow | Automated deployment |

## Source Code

| Directory | Contents |
|-----------|----------|
| [src/](src/) | Contract source code |
| [target/](target/) | Build artifacts |

## Quick Commands

### Installation
```bash
make install          # Install all dependencies
```

### Development
```bash
make build           # Build contract
make test            # Run tests
make check           # Check Stylus compatibility
make dev             # Build and test
```

### Deployment
```bash
make deploy PRIVATE_KEY=xxx                    # Deploy contract
make verify CONTRACT_ADDRESS=0x...             # Verify deployment
make export-abi                                 # Export ABI
make deploy-full PRIVATE_KEY=xxx               # Full pipeline
```

### Utilities
```bash
make info            # Show network info
make clean           # Clean build artifacts
make help            # Show all targets
```

## Deployment Workflows

### Quick Deploy (Development)
1. Read [QUICKSTART.md](QUICKSTART.md)
2. Run `make install`
3. Run `make deploy PRIVATE_KEY=xxx`
4. Save contract address

### Full Deploy (Production)
1. Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. Check gas: `./scripts/check-gas-price.sh`
3. Deploy: `PRIVATE_KEY=xxx ./scripts/deploy-and-verify.sh`
4. Monitor: `./scripts/monitor-deployment.sh 0x...`

### CI/CD Deploy
1. Configure GitHub secrets
2. Run workflow via GitHub UI
3. Download deployment artifacts

## File Permissions

All scripts should be executable. If not:
```bash
chmod +x deploy.sh verify.sh export-abi.sh test-deployment.sh
chmod +x scripts/*.sh
```

## Environment Setup

1. Copy environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your configuration:
   ```env
   PRIVATE_KEY=your_private_key_here
   ```

3. Never commit `.env` file

## Network Information

**Varity L3 Testnet**
- RPC: https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz
- Chain ID: 33529
- Explorer: https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz

## Getting Started Paths

### I want to deploy quickly (5 minutes)
→ [QUICKSTART.md](QUICKSTART.md)

### I want full deployment control
→ [DEPLOYMENT.md](DEPLOYMENT.md)

### I want to understand the contract
→ [README.md](README.md)

### I want to automate with CI/CD
→ [DEPLOYMENT.md](DEPLOYMENT.md#cicd-deployment)

### I want to monitor my deployment
→ Use `./scripts/monitor-deployment.sh 0x...`

### I need help troubleshooting
→ [DEPLOYMENT.md](DEPLOYMENT.md#troubleshooting)

## Support Resources

- Contract documentation: [README.md](README.md)
- Deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- Quick start: [QUICKSTART.md](QUICKSTART.md)
- File overview: [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)
- Varity L3 Explorer: https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz
- Arbitrum Stylus Docs: https://docs.arbitrum.io/stylus/

## Recommended Reading Order

1. **First Time Users**
   - README.md (overview)
   - QUICKSTART.md (quick deploy)
   - Deploy and verify

2. **Production Deployment**
   - README.md (overview)
   - DEPLOYMENT.md (comprehensive guide)
   - deployment.config.json (configure)
   - Deploy with full pipeline

3. **CI/CD Setup**
   - DEPLOYMENT.md (CI/CD section)
   - .github/workflows/deploy.yml (workflow)
   - Configure secrets and deploy

4. **Troubleshooting**
   - DEPLOYMENT.md (troubleshooting section)
   - Check script outputs
   - Review explorer

## File Tree

```
contracts/
├── Documentation
│   ├── README.md                    # Main documentation
│   ├── QUICKSTART.md                # Quick start guide
│   ├── DEPLOYMENT.md                # Deployment guide
│   ├── DEPLOYMENT_SUMMARY.md        # Infrastructure overview
│   └── INDEX.md                     # This file
│
├── Deployment Scripts
│   ├── deploy.sh                    # Main deployment
│   ├── verify.sh                    # Verification
│   ├── export-abi.sh                # ABI export
│   ├── test-deployment.sh           # Testing
│   └── scripts/
│       ├── deploy-and-verify.sh     # Full pipeline
│       ├── post-deploy.sh           # Post-deploy automation
│       ├── monitor-deployment.sh    # Monitoring
│       └── check-gas-price.sh       # Gas checker
│
├── Configuration
│   ├── .env.example                 # Environment template
│   ├── deployment.config.json       # Deployment config
│   ├── .gitignore                   # Git ignore rules
│   ├── Cargo.toml                   # Rust manifest
│   └── Makefile                     # Build automation
│
├── CI/CD
│   └── .github/workflows/
│       └── deploy.yml               # GitHub Actions
│
└── Source Code
    └── src/                         # Contract source
```

## Quick Reference

### Most Used Commands

```bash
# Deploy
make deploy PRIVATE_KEY=xxx

# Verify
make verify CONTRACT_ADDRESS=0x...

# Full pipeline
PRIVATE_KEY=xxx ./scripts/deploy-and-verify.sh

# Monitor
./scripts/monitor-deployment.sh 0x...

# Check gas
./scripts/check-gas-price.sh
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| PRIVATE_KEY | Yes (deploy) | Deployer private key |
| CONTRACT_ADDRESS | Yes (verify) | Deployed contract address |
| ENDPOINT | No | Custom RPC endpoint |
| OUTPUT_DIR | No | ABI output directory |

### Network Endpoints

| Network | RPC |
|---------|-----|
| Testnet | https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz |
| Mainnet | TBD |

---

**Need help?** Start with [QUICKSTART.md](QUICKSTART.md) for fast deployment or [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive guide.
