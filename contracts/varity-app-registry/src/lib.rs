#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use alloc::string::String;
use stylus_sdk::{
    alloy_primitives::{Address, U256},
    alloy_sol_types::sol,
    prelude::*,
};

// ============================================================================
// Events and Errors
// ============================================================================

sol! {
    event AppRegistered(uint256 indexed app_id, address indexed developer, string name, string app_type, string tier);
    event AppApproved(uint256 indexed app_id, address indexed approver);
    event AppRejected(uint256 indexed app_id, address indexed approver);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);

    error Unauthorized();
    error InvalidInput();
    error AppNotFound();
    error AlreadyApproved();
    error InvalidTier();
}

#[derive(SolidityError)]
pub enum RegistryError {
    Unauthorized(Unauthorized),
    InvalidInput(InvalidInput),
    AppNotFound(AppNotFound),
    AlreadyApproved(AlreadyApproved),
    InvalidTier(InvalidTier),
}

// ============================================================================
// Storage Structure
// ============================================================================

sol_storage! {
    #[entrypoint]
    pub struct VarityAppRegistry {
        // Total number of registered apps
        uint256 app_count;

        // Admin addresses with approval rights
        mapping(address => bool) admins;

        // App data storage (indexed by app_id)
        // We store each field separately due to Stylus storage limitations
        mapping(uint256 => string) app_names;
        mapping(uint256 => string) app_descriptions;
        mapping(uint256 => address) app_developers;
        mapping(uint256 => string) app_types;
        mapping(uint256 => string) app_categories;
        mapping(uint256 => string) app_versions;
        mapping(uint256 => string) app_logos;
        mapping(uint256 => string) app_screenshots; // Comma-separated URLs
        mapping(uint256 => string) app_demo_urls;
        mapping(uint256 => string) app_repos;
        mapping(uint256 => uint256) app_prices;
        mapping(uint256 => bool) app_is_approved;
        mapping(uint256 => string) app_tiers; // Infrastructure tier: "free", "starter", "growth", "enterprise"

        // List of pending app IDs awaiting approval
        uint256[] pending_apps;
    }
}

// ============================================================================
// Core Implementation
// ============================================================================

#[public]
impl VarityAppRegistry {
    /// Constructor - sets deployer as initial admin
    pub fn init(&mut self) -> Result<(), RegistryError> {
        let deployer = contract::msg_sender();
        self.admins.insert(deployer, true);
        AdminAdded { admin: deployer }.emit();
        Ok(())
    }

    /// Register a new app (anyone can register)
    /// Follows Checks-Effects-Interactions (CEI) pattern
    #[allow(clippy::too_many_arguments)]
    pub fn register_app(
        &mut self,
        name: String,
        description: String,
        app_type: String,
        category: String,
        version: String,
        logo_url: String,
        screenshots: String, // Comma-separated URLs
        demo_url: String,
        repo_url: String,
        price_usdc: U256,
        tier: String, // Infrastructure tier: "free", "starter", "growth", "enterprise"
    ) -> Result<U256, RegistryError> {
        // CHECKS: Validate inputs
        if name.is_empty() {
            return Err(RegistryError::InvalidInput(InvalidInput {}));
        }
        if description.is_empty() {
            return Err(RegistryError::InvalidInput(InvalidInput {}));
        }
        if app_type.is_empty() {
            return Err(RegistryError::InvalidInput(InvalidInput {}));
        }
        // Validate tier - must be one of: free, starter, growth, enterprise
        if tier != "free" && tier != "starter" && tier != "growth" && tier != "enterprise" {
            return Err(RegistryError::InvalidTier(InvalidTier {}));
        }

        // EFFECTS: Update state
        let app_id = self.app_count.get();
        let next_id = app_id + U256::from(1);
        self.app_count.set(next_id);

        let developer = contract::msg_sender();

        // Store app data
        self.app_names.setter(app_id).set_str(name.clone());
        self.app_descriptions.setter(app_id).set_str(description);
        self.app_developers.insert(app_id, developer);
        self.app_types.setter(app_id).set_str(app_type.clone());
        self.app_categories.setter(app_id).set_str(category);
        self.app_versions.setter(app_id).set_str(version);
        self.app_logos.setter(app_id).set_str(logo_url);
        self.app_screenshots.setter(app_id).set_str(screenshots);
        self.app_demo_urls.setter(app_id).set_str(demo_url);
        self.app_repos.setter(app_id).set_str(repo_url);
        self.app_prices.insert(app_id, price_usdc);
        self.app_is_approved.insert(app_id, false);
        self.app_tiers.setter(app_id).set_str(tier.clone());

        // Add to pending queue
        self.pending_apps.push(app_id);

        // INTERACTIONS: Emit event
        AppRegistered {
            app_id,
            developer,
            name,
            app_type,
            tier,
        }.emit();

        Ok(app_id)
    }

    /// Approve an app (admin only)
    pub fn approve_app(&mut self, app_id: U256) -> Result<(), RegistryError> {
        // CHECKS
        if !self.admins.get(contract::msg_sender()) {
            return Err(RegistryError::Unauthorized(Unauthorized {}));
        }

        let app_exists = self.app_developers.get(app_id) != Address::ZERO;
        if !app_exists {
            return Err(RegistryError::AppNotFound(AppNotFound {}));
        }

        if self.app_is_approved.get(app_id) {
            return Err(RegistryError::AlreadyApproved(AlreadyApproved {}));
        }

        // EFFECTS
        self.app_is_approved.insert(app_id, true);

        // Remove from pending queue
        self.remove_from_pending(app_id);

        // INTERACTIONS
        AppApproved {
            app_id,
            approver: contract::msg_sender(),
        }.emit();

        Ok(())
    }

    /// Reject an app (admin only)
    pub fn reject_app(&mut self, app_id: U256) -> Result<(), RegistryError> {
        // CHECKS
        if !self.admins.get(contract::msg_sender()) {
            return Err(RegistryError::Unauthorized(Unauthorized {}));
        }

        let app_exists = self.app_developers.get(app_id) != Address::ZERO;
        if !app_exists {
            return Err(RegistryError::AppNotFound(AppNotFound {}));
        }

        // EFFECTS
        // Remove from pending queue
        self.remove_from_pending(app_id);

        // INTERACTIONS
        AppRejected {
            app_id,
            approver: contract::msg_sender(),
        }.emit();

        Ok(())
    }

    /// Add admin (admin only)
    pub fn add_admin(&mut self, new_admin: Address) -> Result<(), RegistryError> {
        // CHECKS
        if !self.admins.get(contract::msg_sender()) {
            return Err(RegistryError::Unauthorized(Unauthorized {}));
        }

        // EFFECTS
        self.admins.insert(new_admin, true);

        // INTERACTIONS
        AdminAdded { admin: new_admin }.emit();

        Ok(())
    }

    /// Remove admin (admin only)
    pub fn remove_admin(&mut self, admin_to_remove: Address) -> Result<(), RegistryError> {
        // CHECKS
        if !self.admins.get(contract::msg_sender()) {
            return Err(RegistryError::Unauthorized(Unauthorized {}));
        }

        // EFFECTS
        self.admins.insert(admin_to_remove, false);

        // INTERACTIONS
        AdminRemoved { admin: admin_to_remove }.emit();

        Ok(())
    }

    /// Get app count
    pub fn get_app_count(&self) -> U256 {
        self.app_count.get()
    }

    /// Check if address is admin
    pub fn is_admin(&self, address: Address) -> bool {
        self.admins.get(address)
    }

    /// Get app developer
    pub fn get_app_developer(&self, app_id: U256) -> Address {
        self.app_developers.get(app_id)
    }

    /// Get app name
    pub fn get_app_name(&self, app_id: U256) -> String {
        self.app_names.getter(app_id).get_string()
    }

    /// Get app approval status
    pub fn is_app_approved(&self, app_id: U256) -> bool {
        self.app_is_approved.get(app_id)
    }

    /// Get app price
    pub fn get_app_price(&self, app_id: U256) -> U256 {
        self.app_prices.get(app_id)
    }

    /// Get app tier (free, starter, growth, enterprise)
    pub fn get_app_tier(&self, app_id: U256) -> String {
        self.app_tiers.getter(app_id).get_string()
    }

    /// Get pending apps count
    pub fn get_pending_count(&self) -> U256 {
        U256::from(self.pending_apps.len())
    }

    /// Get pending app ID by index
    pub fn get_pending_app(&self, index: U256) -> Result<U256, RegistryError> {
        let idx = index.try_into().map_err(|_| RegistryError::InvalidInput(InvalidInput))?;

        if idx >= self.pending_apps.len() {
            return Err(RegistryError::AppNotFound(AppNotFound {}));
        }

        Ok(self.pending_apps.get(idx).unwrap())
    }
}

// ============================================================================
// Internal Helper Functions
// ============================================================================

impl VarityAppRegistry {
    /// Remove app from pending queue
    fn remove_from_pending(&mut self, app_id: U256) {
        let len = self.pending_apps.len();

        // Find and remove the app_id
        for i in 0..len {
            if let Some(stored_id) = self.pending_apps.get(i) {
                if stored_id == app_id {
                    // Swap with last element and pop
                    if i < len - 1 {
                        let last = self.pending_apps.get(len - 1).unwrap();
                        self.pending_apps.setter(i).unwrap().set(last);
                    }
                    self.pending_apps.pop();
                    break;
                }
            }
        }
    }
}

// ============================================================================
// Tests
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_compile() {
        // Basic compile test
        assert!(true);
    }
}