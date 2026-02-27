#!/usr/bin/env python3
"""
Initialize the VarityAppRegistry contract.
Sets deployer as the first admin.

Usage:
  PRIVATE_KEY=your_key python3 initialize.py

This script reads PRIVATE_KEY from environment only — nothing is saved to disk.
"""

import os
import sys
from web3 import Web3

CONTRACT_ADDRESS = "0xbf9f4849a5508e9f271c30205c1ce924328e5e1c"
RPC_URL = "https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz"
CHAIN_ID = 33529

# Minimal ABI — just the initialize function
ABI = [
    {
        "name": "initialize",
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [],
        "outputs": [],
    }
]


def main():
    private_key = os.environ.get("PRIVATE_KEY")
    if not private_key:
        print("Error: PRIVATE_KEY environment variable required")
        print("Usage: PRIVATE_KEY=your_key python3 initialize.py")
        sys.exit(1)

    # Connect
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    if not w3.is_connected():
        print("Error: Could not connect to Varity L3 RPC")
        sys.exit(1)

    print(f"Connected to Varity L3 (Chain ID: {CHAIN_ID})")
    print(f"Contract: {CONTRACT_ADDRESS}")

    # Get account from private key
    account = w3.eth.account.from_key(private_key)
    print(f"Wallet: {account.address}")

    balance = w3.eth.get_balance(account.address)
    print(f"Balance: {w3.from_wei(balance, 'ether')} USDC")

    if balance == 0:
        print("Error: Wallet has 0 balance. Fund it with USDC on Varity L3 first.")
        sys.exit(1)

    # Build transaction
    contract = w3.eth.contract(
        address=Web3.to_checksum_address(CONTRACT_ADDRESS),
        abi=ABI,
    )

    print("\nSending initialize() transaction...")

    tx = contract.functions.initialize().build_transaction(
        {
            "from": account.address,
            "nonce": w3.eth.get_transaction_count(account.address),
            "chainId": CHAIN_ID,
            "gas": 200000,
            "gasPrice": w3.eth.gas_price,
        }
    )

    signed = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)

    print(f"Tx hash: {tx_hash.hex()}")
    print("Waiting for confirmation...")

    receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)

    if receipt["status"] == 1:
        print(f"\nInitialize successful!")
        print(f"Tx: {tx_hash.hex()}")
        print(f"Gas used: {receipt['gasUsed']}")
        print(f"\nYour wallet ({account.address}) is now the contract admin.")
    else:
        print(f"\nTransaction FAILED")
        print(f"Tx: {tx_hash.hex()}")
        sys.exit(1)


if __name__ == "__main__":
    main()
