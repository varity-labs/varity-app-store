# Varity App Registry - Makefile

.PHONY: help build test clean deploy verify export-abi check install

ENDPOINT := https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz
CHAIN_ID := 33529

help: ## Show this help message
	@echo "Varity App Registry - Contract Build System"
	@echo ""
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies and tools
	@echo "Installing Rust toolchain..."
	rustup target add wasm32-unknown-unknown
	@echo "Installing cargo-stylus..."
	cargo install cargo-stylus
	@echo "Installation complete!"

build: ## Build the contract
	@echo "Building contract..."
	cargo build --release --target wasm32-unknown-unknown

test: ## Run tests
	@echo "Running tests..."
	cargo test

check: ## Check contract compatibility with Stylus
	@echo "Checking contract..."
	cargo stylus check --endpoint $(ENDPOINT)

export-abi: ## Export contract ABI
	@echo "Exporting ABI..."
	./export-abi.sh

deploy: ## Deploy contract to Varity L3
	@echo "Deploying contract..."
	@if [ -z "$(PRIVATE_KEY)" ]; then \
		echo "Error: PRIVATE_KEY not set"; \
		echo "Usage: make deploy PRIVATE_KEY=your_key"; \
		exit 1; \
	fi
	./deploy.sh

verify: ## Verify deployed contract
	@echo "Verifying contract..."
	@if [ -z "$(CONTRACT_ADDRESS)" ]; then \
		echo "Error: CONTRACT_ADDRESS not set"; \
		echo "Usage: make verify CONTRACT_ADDRESS=0x..."; \
		exit 1; \
	fi
	./verify.sh

clean: ## Clean build artifacts
	@echo "Cleaning build artifacts..."
	cargo clean
	rm -rf abi/

dev: build test ## Build and test (development workflow)
	@echo "Development build complete!"

deploy-full: build check deploy ## Full deployment workflow
	@echo "Full deployment complete!"

info: ## Show network information
	@echo "Network Information:"
	@echo "  RPC: $(ENDPOINT)"
	@echo "  Chain ID: $(CHAIN_ID)"
	@echo "  Explorer: https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz"

.DEFAULT_GOAL := help
