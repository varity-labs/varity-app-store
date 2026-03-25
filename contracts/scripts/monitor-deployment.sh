#!/bin/bash

CONTRACT_ADDRESS="${1:-}"
ENDPOINT="https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz"

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "Usage: ./monitor-deployment.sh <contract_address>"
    exit 1
fi

echo "=========================================="
echo "Contract Monitoring Dashboard"
echo "=========================================="
echo ""
echo "Contract: $CONTRACT_ADDRESS"
echo "Network: Varity L3 Testnet"
echo ""

# Function to make RPC call
rpc_call() {
    local method=$1
    local params=$2
    curl -s -X POST \
        -H "Content-Type: application/json" \
        --data "{\"jsonrpc\":\"2.0\",\"method\":\"$method\",\"params\":$params,\"id\":1}" \
        $ENDPOINT
}

# Get contract bytecode size
echo "Contract Information:"
echo "-------------------"
CODE=$(rpc_call "eth_getCode" "[\"$CONTRACT_ADDRESS\", \"latest\"]" | grep -oP '"result":"\K[^"]+')
CODE_SIZE=$((${#CODE} / 2 - 1))
echo "Bytecode size: $CODE_SIZE bytes"

# Get transaction count (contract interactions)
TX_COUNT=$(rpc_call "eth_getTransactionCount" "[\"$CONTRACT_ADDRESS\", \"latest\"]" | grep -oP '"result":"\K[^"]+')
TX_COUNT_DEC=$((TX_COUNT))
echo "Transaction count: $TX_COUNT_DEC"

# Get balance
BALANCE=$(rpc_call "eth_getBalance" "[\"$CONTRACT_ADDRESS\", \"latest\"]" | grep -oP '"result":"\K[^"]+')
BALANCE_DEC=$((BALANCE))
echo "Balance: $BALANCE_DEC wei ($(echo "scale=6; $BALANCE_DEC / 1000000" | bc) USDC)"

echo ""
echo "Explorer Links:"
echo "--------------"
echo "Contract: https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz/address/$CONTRACT_ADDRESS"
echo "Transactions: https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz/address/$CONTRACT_ADDRESS#transactions"
echo "Events: https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz/address/$CONTRACT_ADDRESS#events"

echo ""
echo "Monitoring active. Press Ctrl+C to stop."
echo ""

# Continuous monitoring
COUNTER=0
while true; do
    sleep 10
    COUNTER=$((COUNTER + 1))

    NEW_TX_COUNT=$(rpc_call "eth_getTransactionCount" "[\"$CONTRACT_ADDRESS\", \"latest\"]" | grep -oP '"result":"\K[^"]+')
    NEW_TX_COUNT_DEC=$((NEW_TX_COUNT))

    if [ "$NEW_TX_COUNT_DEC" != "$TX_COUNT_DEC" ]; then
        DIFF=$((NEW_TX_COUNT_DEC - TX_COUNT_DEC))
        echo "[$(date +%H:%M:%S)] New activity detected: +$DIFF transactions (total: $NEW_TX_COUNT_DEC)"
        TX_COUNT_DEC=$NEW_TX_COUNT_DEC
    fi

    # Show heartbeat every minute
    if [ $((COUNTER % 6)) -eq 0 ]; then
        echo "[$(date +%H:%M:%S)] Monitoring... ($TX_COUNT_DEC transactions)"
    fi
done
