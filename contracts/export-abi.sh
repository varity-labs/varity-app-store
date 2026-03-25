#!/bin/bash
set -e

OUTPUT_DIR="${OUTPUT_DIR:-./abi}"

echo "=========================================="
echo "Varity App Registry - ABI Export"
echo "=========================================="
echo ""

echo "[1/2] Building with export-abi feature..."
cargo build --features export-abi

echo ""
echo "[2/2] Exporting ABI..."
mkdir -p $OUTPUT_DIR

cargo run --features export-abi --bin export-abi > $OUTPUT_DIR/VarityAppRegistry.json

echo ""
echo "ABI exported successfully!"
echo "Location: $OUTPUT_DIR/VarityAppRegistry.json"
echo ""
echo "Copy this ABI to frontend:"
echo "cp $OUTPUT_DIR/VarityAppRegistry.json ../frontend/src/contracts/"
