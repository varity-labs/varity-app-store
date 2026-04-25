# Contributing to Varity App Store

Thank you for your interest in contributing to the Varity App Store.

## Setup

```bash
git clone https://github.com/varity-labs/varity-app-store.git
cd varity-app-store
npm install
npm run dev
# Open http://localhost:3000
```

## Making Changes

Pages are in `src/app/`. Components in `src/components/`.

```bash
npm run build    # Verify the build passes before submitting a PR
npm run lint     # Fix any lint errors
```

## Content Guidelines

All copy must follow the positioning rules:

- **No em-dashes** in prose — use "and", "or", "with", or a colon instead
- **No forbidden vocabulary:** blockchain, crypto, web3, decentralized, DePIN, wallet, gas, Akash, IPFS, etc.
- **Approved taglines only** — use the copy from POSITIONING.md, do not invent new claims

## Submitting a PR

```bash
git checkout -b my-fix
git add .
git commit -m "fix: descriptive message"
git push origin my-fix
```

Open a PR on GitHub with a clear description of what changed and why, plus screenshots for visual changes.

## Questions?

Join [Discord](https://discord.gg/7vWsdwa2Bg) for the fastest response.

## License

By contributing, you agree your contributions will be licensed under the MIT License.
