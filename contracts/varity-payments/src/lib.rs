//! VarityPayments - Varity Payment Processing Smart Contract
//!
//! A high-performance payment contract built with Rust + Arbitrum Stylus.
//! Deployed on Arbitrum One (Chain ID 42161) for real USDC payments.
//!
//! Key Features:
//! - App purchases with 90/10 revenue split (90% developer, 10% Varity)
//! - Developer billing for infrastructure tiers + partnership services (100% to Varity)
//! - Uses ERC-20 USDC on Arbitrum One (requires user to approve() contract first)
//!
//! Revenue Streams:
//! - #1: Infrastructure Tiers ($49-199/mo) - via pay_bill()
//! - #2: Partnership Margins (20% on Privy/thirdweb) - via pay_bill()
//! - #3: App Store Commission (10%) - via purchase_app()

#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::prelude::*;
use stylus_sdk::call::RawCall;
use alloy_primitives::{Address, U256};
use alloy_sol_types::{sol, SolCall};
use alloc::vec::Vec;

// ============ ERC-20 Function Signatures ============

sol! {
    /// ERC-20 transferFrom for pulling USDC from user
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

// ============ Constants ============

/// Platform fee: 10% = 1000 basis points
const PLATFORM_FEE_BPS: u64 = 1000;

/// Basis points denominator
const BPS_DENOMINATOR: u64 = 10000;

/// Varity Treasury wallet - receives all platform fees
/// Address: 0xA0b83bBeF45FeE8c8E158b25b736E05eBd51b793
const TREASURY: [u8; 20] = [
    0xA0, 0xb8, 0x3b, 0xBe, 0xF4, 0x5F, 0xeE, 0x8c, 0x8E, 0x15,
    0x8b, 0x25, 0xb7, 0x36, 0xE0, 0x5e, 0xBd, 0x51, 0xb7, 0x93
];

/// USDC token address on Arbitrum One
/// https://arbiscan.io/token/0xaf88d065e77c8cC2239327C5EDb3A432268e5831
const USDC_ADDRESS: [u8; 20] = [
    0xaf, 0x88, 0xd0, 0x65, 0xe7, 0x7c, 0x8c, 0xc2, 0x23, 0x93,
    0x27, 0xc5, 0xed, 0xb3, 0xa4, 0x32, 0x26, 0x8e, 0x58, 0x31
];

// ============ Error Codes ============

const ERROR_UNAUTHORIZED: &[u8] = b"Unauthorized";
const ERROR_INVALID_PRICE: &[u8] = b"InvalidPrice";
const ERROR_INVALID_APP_ID: &[u8] = b"InvalidAppId";
const ERROR_APP_NOT_FOR_SALE: &[u8] = b"AppNotForSale";
const ERROR_INSUFFICIENT_PAYMENT: &[u8] = b"InsufficientPayment";
const ERROR_TRANSFER_FAILED: &[u8] = b"TransferFailed";
const ERROR_ALREADY_PURCHASED: &[u8] = b"AlreadyPurchased";
const ERROR_INVALID_PERIOD: &[u8] = b"InvalidPeriod";

// ============ Events (Solidity ABI compatible) ============

sol! {
    /// Emitted when an app price is set by developer
    event AppPriceSet(
        uint256 indexed app_id,
        address indexed developer,
        uint256 price_usdc,
        bool is_subscription,
        uint256 interval_days
    );

    /// Emitted when an app is purchased (Revenue Stream #3)
    event AppPurchased(
        uint256 indexed app_id,
        address indexed buyer,
        address indexed developer,
        uint256 total_amount,
        uint256 developer_share,
        uint256 platform_fee,
        uint256 timestamp
    );

    /// Emitted when a developer pays their bill (Revenue Streams #1 + #2)
    event BillingPayment(
        uint256 indexed app_id,
        address indexed developer,
        uint256 amount,
        uint256 period_hash,
        uint256 timestamp
    );
}

// ============ Storage ============

sol_storage! {
    #[entrypoint]
    pub struct VarityPayments {
        /// Contract owner
        address owner;

        /// App pricing: app_id => price in USDC (6 decimals)
        mapping(uint256 => uint256) app_prices;

        /// App pricing: app_id => developer address
        mapping(uint256 => address) app_developers;

        /// App pricing: app_id => is subscription (vs one-time)
        mapping(uint256 => bool) app_is_subscription;

        /// App pricing: app_id => billing interval in days (for subscriptions)
        mapping(uint256 => uint256) app_interval_days;

        /// App pricing: app_id => is active (pricing set)
        mapping(uint256 => bool) app_pricing_active;

        /// Purchase tracking: app_id => buyer => has purchased
        mapping(uint256 => mapping(address => bool)) has_purchased;

        /// Billing payments: app_id => period_hash => amount paid
        mapping(uint256 => mapping(uint256 => uint256)) billing_payments;

        /// Total platform revenue (for analytics)
        uint256 total_platform_revenue;

        /// Total developer payouts (for analytics)
        uint256 total_developer_payouts;
    }
}

#[public]
impl VarityPayments {
    /// Initialize contract (set deployer as owner)
    pub fn initialize(&mut self) -> Result<(), Vec<u8>> {
        let deployer = self.__stylus_host.msg_sender();

        // Only initialize once (check if owner is zero)
        if self.owner.get() != Address::ZERO {
            return Ok(()); // Already initialized
        }

        self.owner.set(deployer);
        self.total_platform_revenue.set(U256::ZERO);
        self.total_developer_payouts.set(U256::ZERO);

        Ok(())
    }

    // ============ Developer Functions ============

    /// Set the price for an app (developer only)
    ///
    /// # Arguments
    /// * `app_id` - The app ID from VarityAppRegistry
    /// * `price_usdc` - Price in USDC (6 decimals, e.g., 99_000_000 = $99)
    /// * `is_subscription` - Whether this is a subscription or one-time purchase
    /// * `interval_days` - Billing interval for subscriptions (e.g., 30 for monthly)
    pub fn set_app_price(
        &mut self,
        app_id: u64,
        price_usdc: u64,
        is_subscription: bool,
        interval_days: u64,
    ) -> Result<(), Vec<u8>> {
        if app_id == 0 {
            return Err(ERROR_INVALID_APP_ID.to_vec());
        }
        if price_usdc == 0 {
            return Err(ERROR_INVALID_PRICE.to_vec());
        }
        if is_subscription && interval_days == 0 {
            return Err(ERROR_INVALID_PRICE.to_vec());
        }

        let app_id_u256 = U256::from(app_id);
        let caller = self.__stylus_host.msg_sender();

        // Store pricing
        self.app_prices.setter(app_id_u256).set(U256::from(price_usdc));
        self.app_developers.setter(app_id_u256).set(caller);
        self.app_is_subscription.setter(app_id_u256).set(is_subscription);
        self.app_interval_days.setter(app_id_u256).set(U256::from(interval_days));
        self.app_pricing_active.setter(app_id_u256).set(true);

        // Emit event
        self.vm().log(AppPriceSet {
            app_id: app_id_u256,
            developer: caller,
            price_usdc: U256::from(price_usdc),
            is_subscription,
            interval_days: U256::from(interval_days),
        });

        Ok(())
    }

    /// Update app price (developer only)
    pub fn update_app_price(&mut self, app_id: u64, new_price_usdc: u64) -> Result<(), Vec<u8>> {
        let app_id_u256 = U256::from(app_id);
        let caller = self.__stylus_host.msg_sender();

        // Check pricing is active
        if !self.app_pricing_active.get(app_id_u256) {
            return Err(ERROR_APP_NOT_FOR_SALE.to_vec());
        }

        // Check caller is the developer
        if self.app_developers.get(app_id_u256) != caller {
            return Err(ERROR_UNAUTHORIZED.to_vec());
        }

        if new_price_usdc == 0 {
            return Err(ERROR_INVALID_PRICE.to_vec());
        }

        // Update price
        self.app_prices.setter(app_id_u256).set(U256::from(new_price_usdc));

        // Emit event
        self.vm().log(AppPriceSet {
            app_id: app_id_u256,
            developer: caller,
            price_usdc: U256::from(new_price_usdc),
            is_subscription: self.app_is_subscription.get(app_id_u256),
            interval_days: self.app_interval_days.get(app_id_u256),
        });

        Ok(())
    }

    /// Deactivate app pricing (developer only)
    pub fn deactivate_app_pricing(&mut self, app_id: u64) -> Result<(), Vec<u8>> {
        let app_id_u256 = U256::from(app_id);
        let caller = self.__stylus_host.msg_sender();

        // Check pricing is active
        if !self.app_pricing_active.get(app_id_u256) {
            return Err(ERROR_APP_NOT_FOR_SALE.to_vec());
        }

        // Check caller is the developer
        if self.app_developers.get(app_id_u256) != caller {
            return Err(ERROR_UNAUTHORIZED.to_vec());
        }

        self.app_pricing_active.setter(app_id_u256).set(false);

        Ok(())
    }

    // ============ Purchase Functions (Revenue Stream #3) ============

    /// Purchase an app — 90% to developer, 10% to Varity treasury
    ///
    /// Uses ERC-20 USDC transferFrom. Buyer must approve() this contract
    /// for the purchase amount before calling.
    ///
    /// On Arbitrum One, thirdweb's payModal handles:
    /// - Credit card → USDC acquisition
    /// - USDC approval for this contract
    /// - Transaction execution
    pub fn purchase_app(&mut self, app_id: u64) -> Result<(), Vec<u8>> {
        let app_id_u256 = U256::from(app_id);
        let buyer = self.__stylus_host.msg_sender();

        // Check pricing is active
        if !self.app_pricing_active.get(app_id_u256) {
            return Err(ERROR_APP_NOT_FOR_SALE.to_vec());
        }

        let price = self.app_prices.get(app_id_u256);
        if price == U256::ZERO {
            return Err(ERROR_APP_NOT_FOR_SALE.to_vec());
        }

        // Check not already purchased
        if self.has_purchased.getter(app_id_u256).get(buyer) {
            return Err(ERROR_ALREADY_PURCHASED.to_vec());
        }

        // Calculate split (90% developer, 10% platform)
        let price_u64 = price.to::<u64>();
        let platform_fee = (price_u64 * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;
        let developer_share = price_u64 - platform_fee;

        let developer = self.app_developers.get(app_id_u256);
        let treasury_addr = Address::from_slice(&TREASURY);

        // === Effects BEFORE interactions (checks-effects-interactions pattern) ===

        // Mark as purchased
        self.has_purchased.setter(app_id_u256).setter(buyer).set(true);

        // Update analytics
        let current_platform_rev = self.total_platform_revenue.get();
        self.total_platform_revenue.set(current_platform_rev + U256::from(platform_fee));

        let current_dev_payouts = self.total_developer_payouts.get();
        self.total_developer_payouts.set(current_dev_payouts + U256::from(developer_share));

        // === Interactions: ERC-20 USDC transfers ===

        // Transfer USDC from buyer to developer (90%)
        self.usdc_transfer_from(buyer, developer, U256::from(developer_share))?;

        // Transfer USDC from buyer to treasury (10%)
        self.usdc_transfer_from(buyer, treasury_addr, U256::from(platform_fee))?;

        // Emit event
        self.vm().log(AppPurchased {
            app_id: app_id_u256,
            buyer,
            developer,
            total_amount: price,
            developer_share: U256::from(developer_share),
            platform_fee: U256::from(platform_fee),
            timestamp: U256::from(self.__stylus_host.block_timestamp()),
        });

        Ok(())
    }

    // ============ Billing Functions (Revenue Streams #1 + #2) ============

    /// Pay monthly bill for infrastructure + services — 100% to Varity treasury
    ///
    /// Uses ERC-20 USDC transferFrom. Developer must approve() this contract
    /// for the bill amount before calling.
    ///
    /// # Arguments
    /// * `app_id` - The app ID being billed for
    /// * `period_hash` - Hash of billing period (e.g., keccak256("2026-02") truncated to u64)
    /// * `amount` - Bill amount in USDC (6 decimals, e.g., 49_000_000 = $49)
    pub fn pay_bill(&mut self, app_id: u64, period_hash: u64, amount: u64) -> Result<(), Vec<u8>> {
        if app_id == 0 {
            return Err(ERROR_INVALID_APP_ID.to_vec());
        }
        if period_hash == 0 {
            return Err(ERROR_INVALID_PERIOD.to_vec());
        }
        if amount == 0 {
            return Err(ERROR_INSUFFICIENT_PAYMENT.to_vec());
        }

        let app_id_u256 = U256::from(app_id);
        let period_u256 = U256::from(period_hash);
        let payment = U256::from(amount);
        let developer = self.__stylus_host.msg_sender();
        let treasury_addr = Address::from_slice(&TREASURY);

        // === Effects BEFORE interactions ===

        // Record payment
        let current_payment = self.billing_payments.getter(app_id_u256).get(period_u256);
        self.billing_payments
            .setter(app_id_u256)
            .setter(period_u256)
            .set(current_payment + payment);

        // Update analytics
        let current_platform_rev = self.total_platform_revenue.get();
        self.total_platform_revenue.set(current_platform_rev + payment);

        // === Interaction: ERC-20 USDC transfer ===

        // Transfer USDC from developer to treasury (100%)
        self.usdc_transfer_from(developer, treasury_addr, payment)?;

        // Emit event
        self.vm().log(BillingPayment {
            app_id: app_id_u256,
            developer,
            amount: payment,
            period_hash: period_u256,
            timestamp: U256::from(self.__stylus_host.block_timestamp()),
        });

        Ok(())
    }

    // ============ View Functions ============

    /// Get app pricing details
    pub fn get_app_pricing(&self, app_id: u64) -> Result<(
        u64,      // price_usdc
        Address,  // developer
        bool,     // is_subscription
        u64,      // interval_days
        bool,     // is_active
    ), Vec<u8>> {
        let app_id_u256 = U256::from(app_id);

        Ok((
            self.app_prices.get(app_id_u256).to::<u64>(),
            self.app_developers.get(app_id_u256),
            self.app_is_subscription.get(app_id_u256),
            self.app_interval_days.get(app_id_u256).to::<u64>(),
            self.app_pricing_active.get(app_id_u256),
        ))
    }

    /// Check if a user has purchased an app
    pub fn has_user_purchased(&self, app_id: u64, buyer: Address) -> Result<bool, Vec<u8>> {
        let app_id_u256 = U256::from(app_id);
        Ok(self.has_purchased.getter(app_id_u256).get(buyer))
    }

    /// Get billing payment for a period
    pub fn get_billing_payment(&self, app_id: u64, period_hash: u64) -> Result<u64, Vec<u8>> {
        let app_id_u256 = U256::from(app_id);
        let period_u256 = U256::from(period_hash);
        Ok(self.billing_payments.getter(app_id_u256).get(period_u256).to::<u64>())
    }

    /// Get total platform revenue (analytics)
    pub fn get_total_platform_revenue(&self) -> Result<u64, Vec<u8>> {
        Ok(self.total_platform_revenue.get().to::<u64>())
    }

    /// Get total developer payouts (analytics)
    pub fn get_total_developer_payouts(&self) -> Result<u64, Vec<u8>> {
        Ok(self.total_developer_payouts.get().to::<u64>())
    }

    /// Get the treasury address
    pub fn get_treasury(&self) -> Result<Address, Vec<u8>> {
        Ok(Address::from_slice(&TREASURY))
    }

    /// Get the USDC token address (Arbitrum One)
    pub fn get_usdc_address(&self) -> Result<Address, Vec<u8>> {
        Ok(Address::from_slice(&USDC_ADDRESS))
    }

    /// Get contract owner
    pub fn get_owner(&self) -> Result<Address, Vec<u8>> {
        Ok(self.owner.get())
    }

    // ============ Admin Functions ============

    /// Transfer ownership (owner only)
    pub fn transfer_ownership(&mut self, new_owner: Address) -> Result<(), Vec<u8>> {
        if self.__stylus_host.msg_sender() != self.owner.get() {
            return Err(ERROR_UNAUTHORIZED.to_vec());
        }
        if new_owner == Address::ZERO {
            return Err(ERROR_UNAUTHORIZED.to_vec());
        }

        self.owner.set(new_owner);
        Ok(())
    }

    // ============ Internal Helpers ============

    /// Transfer ERC-20 USDC from one address to another via transferFrom
    /// Requires the `from` address to have approved this contract
    fn usdc_transfer_from(&self, from: Address, to: Address, amount: U256) -> Result<(), Vec<u8>> {
        let usdc_addr = Address::from_slice(&USDC_ADDRESS);

        // Encode transferFrom(from, to, amount)
        let calldata = transferFromCall {
            from,
            to,
            amount,
        }.abi_encode();

        // Call USDC contract
        unsafe {
            RawCall::new(&self.__stylus_host)
                .call(usdc_addr, &calldata)
                .map_err(|_| ERROR_TRANSFER_FAILED.to_vec())?;
        }

        Ok(())
    }
}
