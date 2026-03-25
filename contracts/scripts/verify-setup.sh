#!/bin/bash

echo "=========================================="
echo "Varity App Registry - Setup Verification"
echo "=========================================="
echo ""

SUCCESS=0
WARNINGS=0
ERRORS=0

# Function to check command
check_command() {
    if command -v $1 &> /dev/null; then
        echo "[OK] $1 is installed"
        SUCCESS=$((SUCCESS + 1))
        return 0
    else
        echo "[ERROR] $1 is not installed"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Function to check file
check_file() {
    if [ -f "$1" ]; then
        echo "[OK] $1 exists"
        SUCCESS=$((SUCCESS + 1))
        return 0
    else
        echo "[ERROR] $1 not found"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Function to check directory
check_directory() {
    if [ -d "$1" ]; then
        echo "[OK] $1 exists"
        SUCCESS=$((SUCCESS + 1))
        return 0
    else
        echo "[ERROR] $1 not found"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Function to check executable
check_executable() {
    if [ -x "$1" ]; then
        echo "[OK] $1 is executable"
        SUCCESS=$((SUCCESS + 1))
        return 0
    else
        echo "[WARN] $1 is not executable"
        WARNINGS=$((WARNINGS + 1))
        return 1
    fi
}

echo "Checking Prerequisites..."
echo "========================="
check_command rustc
check_command cargo
check_command git

# Check Rust target
if rustup target list | grep -q "wasm32-unknown-unknown (installed)"; then
    echo "[OK] wasm32-unknown-unknown target installed"
    SUCCESS=$((SUCCESS + 1))
else
    echo "[ERROR] wasm32-unknown-unknown target not installed"
    echo "       Run: rustup target add wasm32-unknown-unknown"
    ERRORS=$((ERRORS + 1))
fi

# Check cargo-stylus
if cargo stylus --version &> /dev/null; then
    VERSION=$(cargo stylus --version)
    echo "[OK] cargo-stylus installed ($VERSION)"
    SUCCESS=$((SUCCESS + 1))
else
    echo "[ERROR] cargo-stylus not installed"
    echo "       Run: cargo install cargo-stylus"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "Checking Project Files..."
echo "=========================="
check_file "Cargo.toml"
check_file "README.md"
check_file "DEPLOYMENT.md"
check_file "QUICKSTART.md"
check_file ".env.example"
check_file "Makefile"
check_file "deployment.config.json"

echo ""
echo "Checking Source Code..."
echo "======================="
check_directory "src"
check_file "src/lib.rs"

echo ""
echo "Checking Deployment Scripts..."
echo "==============================="
check_file "deploy.sh"
check_file "verify.sh"
check_file "export-abi.sh"
check_file "test-deployment.sh"

echo ""
check_executable "deploy.sh"
check_executable "verify.sh"
check_executable "export-abi.sh"
check_executable "test-deployment.sh"

echo ""
echo "Checking Advanced Scripts..."
echo "============================="
check_directory "scripts"
check_file "scripts/deploy-and-verify.sh"
check_file "scripts/post-deploy.sh"
check_file "scripts/monitor-deployment.sh"
check_file "scripts/check-gas-price.sh"

echo ""
check_executable "scripts/deploy-and-verify.sh"
check_executable "scripts/post-deploy.sh"
check_executable "scripts/monitor-deployment.sh"
check_executable "scripts/check-gas-price.sh"

echo ""
echo "Checking Environment..."
echo "======================="
if [ -f ".env" ]; then
    echo "[OK] .env file exists"
    SUCCESS=$((SUCCESS + 1))

    if grep -q "PRIVATE_KEY=your_private_key_here" ".env"; then
        echo "[WARN] .env still contains placeholder values"
        echo "       Update PRIVATE_KEY before deploying"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "[WARN] .env file not found"
    echo "       Copy .env.example to .env and configure"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "Testing Network Connectivity..."
echo "================================"
RPC="https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz"
if curl -s -X POST -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
    $RPC | grep -q "0x82e9"; then
    echo "[OK] Can connect to Varity L3 Testnet"
    echo "     Chain ID: 33529 (0x82e9)"
    SUCCESS=$((SUCCESS + 1))
else
    echo "[ERROR] Cannot connect to Varity L3 Testnet"
    echo "       Check network connectivity"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "Testing Build..."
echo "================"
if cargo build --target wasm32-unknown-unknown 2>&1 | grep -q "Finished"; then
    echo "[OK] Contract builds successfully"
    SUCCESS=$((SUCCESS + 1))
else
    echo "[WARN] Build test skipped or failed"
    echo "       Run 'cargo build --target wasm32-unknown-unknown' to verify"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "=========================================="
echo "Setup Verification Complete"
echo "=========================================="
echo ""
echo "Results:"
echo "  Success: $SUCCESS"
echo "  Warnings: $WARNINGS"
echo "  Errors: $ERRORS"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo "Status: READY TO DEPLOY"
    echo ""
    echo "Next steps:"
    echo "1. Configure .env file with your PRIVATE_KEY"
    echo "2. Read QUICKSTART.md for fast deployment"
    echo "3. Or read DEPLOYMENT.md for comprehensive guide"
    echo "4. Deploy: make deploy PRIVATE_KEY=xxx"
    exit 0
else
    echo "Status: NOT READY"
    echo ""
    echo "Fix the errors above before deploying."
    echo ""
    echo "Quick fixes:"
    echo "- Install Rust: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    echo "- Add wasm32 target: rustup target add wasm32-unknown-unknown"
    echo "- Install cargo-stylus: cargo install cargo-stylus"
    echo "- Make scripts executable: chmod +x *.sh scripts/*.sh"
    exit 1
fi
