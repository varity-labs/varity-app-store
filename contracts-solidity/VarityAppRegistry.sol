// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VarityAppRegistry
 * @author Varity
 * @notice Smart contract registry for Varity App Store
 * @dev Deployed on Varity L3 (Chain ID 33529)
 *
 * Features:
 * - Multi-chain app support (apps can be deployed on any chain)
 * - Quality curation with manual approval process
 * - Admin access control
 * - Developer self-service (register, update, deactivate)
 * - Filtering by category, chain, and developer
 */
contract VarityAppRegistry {
    // ========== STRUCTS ==========

    struct App {
        uint64 id;
        string name;
        string description;
        string appUrl;
        string logoUrl;
        string category;
        uint64 chainId;
        address developer;
        bool isActive;
        bool isApproved;
        uint64 createdAt;
        bool builtWithVarity;
        string githubUrl;
        string[] screenshots;
    }

    // ========== STATE VARIABLES ==========

    uint64 public nextAppId = 1;
    address public owner;

    mapping(uint64 => App) public apps;
    mapping(address => bool) public admins;

    uint64[] public pendingApps;
    uint64[] public featuredApps;

    // ========== EVENTS ==========

    event AppRegistered(
        uint64 indexed appId,
        address indexed developer,
        string name,
        string category,
        uint64 chainId
    );
    event AppApproved(uint64 indexed appId, address indexed admin);
    event AppRejected(uint64 indexed appId, address indexed admin, string reason);
    event AppUpdated(uint64 indexed appId, address indexed developer);
    event AppDeactivated(uint64 indexed appId, address indexed developer);
    event AppFeatured(uint64 indexed appId, address indexed admin);
    event AdminAdded(address indexed admin, address indexed addedBy);

    // ========== ERRORS ==========

    error Unauthorized();
    error AppNotFound();
    error AppAlreadyApproved();
    error AppNotApproved();
    error InvalidInput();

    // ========== MODIFIERS ==========

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyAdmin() {
        if (!admins[msg.sender]) revert Unauthorized();
        _;
    }

    modifier onlyDeveloper(uint64 appId) {
        if (apps[appId].developer != msg.sender) revert Unauthorized();
        _;
    }

    modifier appExists(uint64 appId) {
        if (apps[appId].developer == address(0)) revert AppNotFound();
        _;
    }

    // ========== CONSTRUCTOR ==========

    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
    }

    // ========== CORE FUNCTIONS ==========

    /**
     * @notice Register a new app (pending approval)
     * @param name App name (max 100 chars)
     * @param description App description (max 1000 chars)
     * @param appUrl Live app URL
     * @param logoUrl Logo URL (IPFS recommended)
     * @param category Category (Business, AI, DeFi, NFT, Social, Dev)
     * @param chainId Chain ID where app is deployed
     * @param builtWithVarity Whether app uses Varity SDK
     * @param githubUrl GitHub repository URL (optional)
     * @param screenshotUrls Array of screenshot URLs (max 5)
     * @return appId Assigned app ID
     */
    function registerApp(
        string memory name,
        string memory description,
        string memory appUrl,
        string memory logoUrl,
        string memory category,
        uint64 chainId,
        bool builtWithVarity,
        string memory githubUrl,
        string[] memory screenshotUrls
    ) external returns (uint64 appId) {
        // Validate inputs
        if (bytes(name).length == 0 || bytes(name).length > 100) revert InvalidInput();
        if (bytes(description).length == 0 || bytes(description).length > 1000) revert InvalidInput();
        if (bytes(appUrl).length == 0) revert InvalidInput();
        if (screenshotUrls.length > 5) revert InvalidInput();

        // Assign app ID
        appId = nextAppId++;

        // Create app
        App storage app = apps[appId];
        app.id = appId;
        app.name = name;
        app.description = description;
        app.appUrl = appUrl;
        app.logoUrl = logoUrl;
        app.category = category;
        app.chainId = chainId;
        app.developer = msg.sender;
        app.isActive = true;
        app.isApproved = false; // Pending by default
        app.createdAt = uint64(block.timestamp);
        app.builtWithVarity = builtWithVarity;
        app.githubUrl = githubUrl;
        app.screenshots = screenshotUrls;

        // Add to pending list
        pendingApps.push(appId);

        emit AppRegistered(appId, msg.sender, name, category, chainId);
    }

    /**
     * @notice Approve an app (admin only)
     * @param appId App ID to approve
     */
    function approveApp(uint64 appId) external onlyAdmin appExists(appId) {
        App storage app = apps[appId];

        if (app.isApproved) revert AppAlreadyApproved();

        app.isApproved = true;

        // Remove from pending list
        _removeFromPendingList(appId);

        emit AppApproved(appId, msg.sender);
    }

    /**
     * @notice Reject an app (admin only)
     * @param appId App ID to reject
     * @param reason Rejection reason (sent to developer)
     */
    function rejectApp(uint64 appId, string memory reason) external onlyAdmin appExists(appId) {
        App storage app = apps[appId];

        app.isActive = false;
        app.isApproved = false;

        // Remove from pending list
        _removeFromPendingList(appId);

        emit AppRejected(appId, msg.sender, reason);
    }

    /**
     * @notice Update app metadata (developer only)
     * @param appId App ID to update
     * @param description New description
     * @param appUrl New app URL
     * @param screenshotUrls New screenshot URLs (max 5)
     */
    function updateApp(
        uint64 appId,
        string memory description,
        string memory appUrl,
        string[] memory screenshotUrls
    ) external onlyDeveloper(appId) appExists(appId) {
        // Validate inputs
        if (bytes(description).length == 0 || bytes(description).length > 1000) revert InvalidInput();
        if (bytes(appUrl).length == 0) revert InvalidInput();
        if (screenshotUrls.length > 5) revert InvalidInput();

        App storage app = apps[appId];
        app.description = description;
        app.appUrl = appUrl;
        app.screenshots = screenshotUrls;

        emit AppUpdated(appId, msg.sender);
    }

    /**
     * @notice Deactivate an app (developer only)
     * @param appId App ID to deactivate
     */
    function deactivateApp(uint64 appId) external onlyDeveloper(appId) appExists(appId) {
        apps[appId].isActive = false;
        emit AppDeactivated(appId, msg.sender);
    }

    /**
     * @notice Feature an app (admin only)
     * @param appId App ID to feature
     */
    function featureApp(uint64 appId) external onlyAdmin appExists(appId) {
        App storage app = apps[appId];

        if (!app.isApproved) revert AppNotApproved();

        featuredApps.push(appId);

        emit AppFeatured(appId, msg.sender);
    }

    /**
     * @notice Add a new admin (owner only)
     * @param admin Address to grant admin permissions
     */
    function addAdmin(address admin) external onlyOwner {
        admins[admin] = true;
        emit AdminAdded(admin, msg.sender);
    }

    // ========== VIEW FUNCTIONS ==========

    /**
     * @notice Get app by ID
     * @param appId App ID to retrieve
     * @return app Full app struct
     */
    function getApp(uint64 appId) external view appExists(appId) returns (App memory app) {
        return apps[appId];
    }

    /**
     * @notice Get pending apps (admin only)
     * @return Array of pending app IDs
     */
    function getPendingApps() external view onlyAdmin returns (uint64[] memory) {
        // Filter out approved/rejected apps
        uint64 count = 0;
        for (uint i = 0; i < pendingApps.length; i++) {
            uint64 appId = pendingApps[i];
            if (apps[appId].isActive && !apps[appId].isApproved) {
                count++;
            }
        }

        uint64[] memory result = new uint64[](count);
        uint64 index = 0;
        for (uint i = 0; i < pendingApps.length; i++) {
            uint64 appId = pendingApps[i];
            if (apps[appId].isActive && !apps[appId].isApproved) {
                result[index++] = appId;
            }
        }

        return result;
    }

    /**
     * @notice Get featured apps
     * @return Array of featured app IDs
     */
    function getFeaturedApps() external view returns (uint64[] memory) {
        return featuredApps;
    }

    /**
     * @notice Get apps by developer
     * @param developer Developer address
     * @param maxResults Maximum number of results
     * @return Array of app IDs owned by developer
     */
    function getAppsByDeveloper(address developer, uint64 maxResults) external view returns (uint64[] memory) {
        uint64 count = 0;
        for (uint64 i = 1; i < nextAppId && count < maxResults; i++) {
            if (apps[i].developer == developer) {
                count++;
            }
        }

        uint64[] memory result = new uint64[](count);
        uint64 index = 0;
        for (uint64 i = 1; i < nextAppId && index < count; i++) {
            if (apps[i].developer == developer) {
                result[index++] = i;
            }
        }

        return result;
    }

    /**
     * @notice Get approved and active apps by category
     * @param category Category to filter by
     * @param maxResults Maximum number of results
     * @return Array of app IDs in the category
     */
    function getAppsByCategory(string memory category, uint64 maxResults) external view returns (uint64[] memory) {
        uint64 count = 0;
        for (uint64 i = 1; i < nextAppId && count < maxResults; i++) {
            App storage app = apps[i];
            if (app.isActive && app.isApproved && keccak256(bytes(app.category)) == keccak256(bytes(category))) {
                count++;
            }
        }

        uint64[] memory result = new uint64[](count);
        uint64 index = 0;
        for (uint64 i = 1; i < nextAppId && index < count; i++) {
            App storage app = apps[i];
            if (app.isActive && app.isApproved && keccak256(bytes(app.category)) == keccak256(bytes(category))) {
                result[index++] = i;
            }
        }

        return result;
    }

    /**
     * @notice Get approved and active apps by chain ID
     * @param chainId Chain ID to filter by
     * @param maxResults Maximum number of results
     * @return Array of app IDs on the chain
     */
    function getAppsByChain(uint64 chainId, uint64 maxResults) external view returns (uint64[] memory) {
        uint64 count = 0;
        for (uint64 i = 1; i < nextAppId && count < maxResults; i++) {
            App storage app = apps[i];
            if (app.isActive && app.isApproved && app.chainId == chainId) {
                count++;
            }
        }

        uint64[] memory result = new uint64[](count);
        uint64 index = 0;
        for (uint64 i = 1; i < nextAppId && index < count; i++) {
            App storage app = apps[i];
            if (app.isActive && app.isApproved && app.chainId == chainId) {
                result[index++] = i;
            }
        }

        return result;
    }

    /**
     * @notice Get all approved and active apps
     * @param maxResults Maximum number of results
     * @return Array of all approved app IDs
     */
    function getAllApps(uint64 maxResults) external view returns (uint64[] memory) {
        uint64 count = 0;
        for (uint64 i = 1; i < nextAppId && count < maxResults; i++) {
            App storage app = apps[i];
            if (app.isActive && app.isApproved) {
                count++;
            }
        }

        uint64[] memory result = new uint64[](count);
        uint64 index = 0;
        for (uint64 i = 1; i < nextAppId && index < count; i++) {
            App storage app = apps[i];
            if (app.isActive && app.isApproved) {
                result[index++] = i;
            }
        }

        return result;
    }

    /**
     * @notice Check if an address is an admin
     * @param account Address to check
     * @return True if address is admin
     */
    function isAdmin(address account) external view returns (bool) {
        return admins[account];
    }

    /**
     * @notice Get total number of apps registered
     * @return Total app count
     */
    function getTotalApps() external view returns (uint64) {
        return nextAppId - 1;
    }

    // ========== INTERNAL FUNCTIONS ==========

    /**
     * @dev Remove app ID from pending list
     * @param appId App ID to remove
     */
    function _removeFromPendingList(uint64 appId) internal {
        for (uint i = 0; i < pendingApps.length; i++) {
            if (pendingApps[i] == appId) {
                // Swap with last element and pop
                pendingApps[i] = pendingApps[pendingApps.length - 1];
                pendingApps.pop();
                break;
            }
        }
    }
}
