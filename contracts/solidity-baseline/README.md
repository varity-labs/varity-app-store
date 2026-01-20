# Solidity Baseline - VarityAppRegistry

This directory contains a **Solidity baseline implementation** of VarityAppRegistry for gas benchmarking.

## Purpose

Compare gas costs between:
- **Solidity (this directory)** - Standard EVM implementation
- **Arbitrum Stylus (parent directory)** - Rust + WebAssembly implementation

**Expected Result:** Stylus achieves **40%+ gas savings** over Solidity

## Quick Start

### Install Dependencies

```bash
npm install
```

### Compile Contract

```bash
npx hardhat compile
```

### Run Gas Measurement

```bash
npx hardhat run scripts/deploy-and-measure.js
```

### View Results

See detailed analysis in: **[SOLIDITY_GAS_BASELINE.md](./SOLIDITY_GAS_BASELINE.md)**

## Gas Results Summary

| Operation | Gas Used |
|-----------|----------|
| Contract Deployment | 2,031,456 |
| register_app() | 712,574 |
| approve_app() | 49,622 |
| feature_app() | 73,981 |
| update_app() | 105,996 |
| add_admin() | 47,242 |
| reject_app() | 31,418 |
| deactivate_app() | 25,559 |

Full breakdown: [SOLIDITY_GAS_BASELINE.md](./SOLIDITY_GAS_BASELINE.md)

## Contract Features

Same functionality as Stylus version:
- App registration with metadata + screenshots
- Admin approval workflow
- Featured apps system
- Multi-chain support
- Developer self-service

## File Structure

```
solidity-baseline/
├── contracts/
│   └── VarityAppRegistry.sol   # Solidity implementation
├── scripts/
│   └── deploy-and-measure.js   # Gas measurement script
├── hardhat.config.js            # Hardhat configuration
├── gas-results.json             # Raw gas data (auto-generated)
├── SOLIDITY_GAS_BASELINE.md     # Full analysis
└── README.md                    # This file
```

## Key Differences from Stylus

1. **Language:** Solidity vs Rust
2. **Compilation:** EVM bytecode vs WebAssembly
3. **Gas Costs:** Standard EVM pricing vs Stylus optimized pricing
4. **Performance:** Solidity loops are expensive, WASM loops are cheap

## Tech Stack

- **Hardhat:** 2.28.0
- **Solidity:** 0.8.24 (via-IR enabled)
- **Ethers.js:** v6
- **Network:** Local Hardhat testnet

## Compiler Settings

```javascript
{
  version: "0.8.24",
  optimizer: { enabled: true, runs: 200 },
  viaIR: true  // Required for complex contracts
}
```

## Next Steps

1. Deploy Stylus version to Arbitrum Sepolia
2. Measure actual gas costs on-chain
3. Compare with this baseline
4. Document savings in main README

## Documentation

- [Full Gas Analysis](./SOLIDITY_GAS_BASELINE.md)
- [Parent Project](../README.md)
- [Stylus Implementation](../src/lib.rs)

---

**Generated:** January 19, 2026
**Agent:** Performance Engineer (Agent 7)
