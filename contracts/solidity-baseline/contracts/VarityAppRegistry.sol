// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title VarityAppRegistry - Solidity Baseline Implementation
/// @notice Gas baseline for comparison with Arbitrum Stylus implementation
/// @dev This is a functionally equivalent Solidity version for gas benchmarking
contract VarityAppRegistry {
    // Errors
    error Unauthorized();
    error AppNotFound();
    error AppAlreadyApproved();
    error AppNotApproved();
    error InvalidInput();

    // Events
    event AppRegistered(uint64 indexed appId, string name, string category, uint64 chainId);
    event AppApproved(uint64 indexed appId);
    event AppRejected(uint64 indexed appId, string reason);
    event AppUpdated(uint64 indexed appId);
    event AppDeactivated(uint64 indexed appId);
    event AppFeatured(uint64 indexed appId);
    event AdminAdded(address indexed admin);

    // Storage
    uint256 public nextAppId;
    mapping(address => bool) public admins;
    address public owner;
    uint256 public pendingCount;
    uint256 public featuredCount;

    // App storage - separate mappings for each field
    mapping(uint256 => string) private appNames;
    mapping(uint256 => string) private appDescriptions;
    mapping(uint256 => string) private appUrls;
    mapping(uint256 => string) private appLogoUrls;
    mapping(uint256 => string) private appCategories;
    mapping(uint256 => uint256) private appChainIds;
    mapping(uint256 => address) private appDevelopers;
    mapping(uint256 => bool) private appIsActive;
    mapping(uint256 => bool) private appIsApproved;
    mapping(uint256 => uint256) private appCreatedAt;
    mapping(uint256 => bool) private appBuiltWithVarity;
    mapping(uint256 => string) private appGithubUrls;
    mapping(uint256 => uint256) private appScreenshotCounts;

    // Screenshot storage (appId => index => url)
    mapping(uint256 => mapping(uint256 => string)) private appScreenshots;

    // Pending and featured arrays (stored as mapping with count)
    mapping(uint256 => uint256) private pendingApps;
    mapping(uint256 => uint256) private featuredApps;

    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
        nextAppId = 1;
        pendingCount = 0;
        featuredCount = 0;
    }

    /// @notice Register a new app (pending approval)
    function registerApp(
        string calldata name,
        string calldata description,
        string calldata appUrl,
        string calldata logoUrl,
        string calldata category,
        uint64 chainId,
        bool builtWithVarity,
        string calldata githubUrl,
        string[] calldata screenshotUrls
    ) external returns (uint64) {
        // Validate inputs
        if (bytes(name).length == 0 || bytes(name).length > 100) revert InvalidInput();
        if (bytes(description).length == 0 || bytes(description).length > 1000) revert InvalidInput();
        if (bytes(appUrl).length == 0) revert InvalidInput();
        if (screenshotUrls.length > 5) revert InvalidInput();

        // Get next app ID
        uint256 appId = nextAppId;
        nextAppId++;

        // Store app data
        appNames[appId] = name;
        appDescriptions[appId] = description;
        appUrls[appId] = appUrl;
        appLogoUrls[appId] = logoUrl;
        appCategories[appId] = category;
        appChainIds[appId] = chainId;
        appDevelopers[appId] = msg.sender;
        appIsActive[appId] = true;
        appIsApproved[appId] = false; // Pending
        appCreatedAt[appId] = block.timestamp;
        appBuiltWithVarity[appId] = builtWithVarity;
        appGithubUrls[appId] = githubUrl;
        appScreenshotCounts[appId] = screenshotUrls.length;

        // Store screenshots
        for (uint256 i = 0; i < screenshotUrls.length; i++) {
            appScreenshots[appId][i] = screenshotUrls[i];
        }

        // Add to pending list
        pendingApps[pendingCount] = appId;
        pendingCount++;

        emit AppRegistered(uint64(appId), name, category, chainId);

        return uint64(appId);
    }

    /// @notice Approve an app (admin only)
    function approveApp(uint64 appId) external {
        // Check admin permission
        if (!admins[msg.sender]) revert Unauthorized();

        uint256 appIdU256 = uint256(appId);

        // Check app exists
        if (appDevelopers[appIdU256] == address(0)) revert AppNotFound();

        // Check not already approved
        if (appIsApproved[appIdU256]) revert AppAlreadyApproved();

        // Approve app
        appIsApproved[appIdU256] = true;

        emit AppApproved(appId);
    }

    /// @notice Reject an app (admin only)
    function rejectApp(uint64 appId, string calldata reason) external {
        // Check admin permission
        if (!admins[msg.sender]) revert Unauthorized();

        uint256 appIdU256 = uint256(appId);

        // Check app exists
        if (appDevelopers[appIdU256] == address(0)) revert AppNotFound();

        // Deactivate app
        appIsActive[appIdU256] = false;
        appIsApproved[appIdU256] = false;

        emit AppRejected(appId, reason);
    }

    /// @notice Update app metadata (developer only)
    function updateApp(
        uint64 appId,
        string calldata description,
        string calldata appUrl,
        string[] calldata screenshotUrls
    ) external {
        uint256 appIdU256 = uint256(appId);

        // Check app exists
        if (appDevelopers[appIdU256] == address(0)) revert AppNotFound();

        // Check sender is developer
        if (appDevelopers[appIdU256] != msg.sender) revert Unauthorized();

        // Validate inputs
        if (bytes(description).length == 0 || bytes(description).length > 1000) revert InvalidInput();
        if (bytes(appUrl).length == 0) revert InvalidInput();
        if (screenshotUrls.length > 5) revert InvalidInput();

        // Update mutable fields
        appDescriptions[appIdU256] = description;
        appUrls[appIdU256] = appUrl;
        appScreenshotCounts[appIdU256] = screenshotUrls.length;

        // Update screenshots
        for (uint256 i = 0; i < screenshotUrls.length; i++) {
            appScreenshots[appIdU256][i] = screenshotUrls[i];
        }

        emit AppUpdated(appId);
    }

    /// @notice Deactivate an app (developer only)
    function deactivateApp(uint64 appId) external {
        uint256 appIdU256 = uint256(appId);

        // Check app exists
        if (appDevelopers[appIdU256] == address(0)) revert AppNotFound();

        // Check sender is developer
        if (appDevelopers[appIdU256] != msg.sender) revert Unauthorized();

        // Deactivate
        appIsActive[appIdU256] = false;

        emit AppDeactivated(appId);
    }

    /// @notice Feature an app (admin only)
    function featureApp(uint64 appId) external {
        // Check admin permission
        if (!admins[msg.sender]) revert Unauthorized();

        uint256 appIdU256 = uint256(appId);

        // Check app exists
        if (appDevelopers[appIdU256] == address(0)) revert AppNotFound();

        // Check app is approved
        if (!appIsApproved[appIdU256]) revert AppNotApproved();

        // Add to featured list
        featuredApps[featuredCount] = appIdU256;
        featuredCount++;

        emit AppFeatured(appId);
    }

    /// @notice Add a new admin (owner only)
    function addAdmin(address admin) external {
        // Only owner can add admins
        if (msg.sender != owner) revert Unauthorized();

        admins[admin] = true;

        emit AdminAdded(admin);
    }

    /// @notice Get app by ID
    function getApp(uint64 appId) external view returns (
        uint64 id,
        string memory name,
        string memory description,
        string memory appUrl,
        string memory logoUrl,
        string memory category,
        uint64 chainId,
        address developer,
        bool isActive,
        bool isApproved,
        uint64 createdAt,
        bool builtWithVarity,
        string memory githubUrl,
        uint64 screenshotCount
    ) {
        uint256 appIdU256 = uint256(appId);

        // Check app exists
        if (appDevelopers[appIdU256] == address(0)) revert AppNotFound();

        return (
            appId,
            appNames[appIdU256],
            appDescriptions[appIdU256],
            appUrls[appIdU256],
            appLogoUrls[appIdU256],
            appCategories[appIdU256],
            uint64(appChainIds[appIdU256]),
            appDevelopers[appIdU256],
            appIsActive[appIdU256],
            appIsApproved[appIdU256],
            uint64(appCreatedAt[appIdU256]),
            appBuiltWithVarity[appIdU256],
            appGithubUrls[appIdU256],
            uint64(appScreenshotCounts[appIdU256])
        );
    }

    /// @notice Get screenshot URL by index
    function getAppScreenshot(uint64 appId, uint64 index) external view returns (string memory) {
        uint256 appIdU256 = uint256(appId);

        // Check app exists
        if (appDevelopers[appIdU256] == address(0)) revert AppNotFound();

        // Check index is valid
        if (index >= appScreenshotCounts[appIdU256]) revert InvalidInput();

        return appScreenshots[appIdU256][index];
    }

    /// @notice Get pending apps (admin only)
    function getPendingApps(uint64 maxResults) external view returns (uint64[] memory) {
        // Check admin permission
        if (!admins[msg.sender]) revert Unauthorized();

        uint256 limit = maxResults < pendingCount ? maxResults : pendingCount;
        uint64[] memory result = new uint64[](limit);
        uint256 resultCount = 0;

        for (uint256 i = 0; i < pendingCount && resultCount < limit; i++) {
            uint256 appId = pendingApps[i];
            // Only include if still pending (not approved)
            if (!appIsApproved[appId] && appIsActive[appId]) {
                result[resultCount] = uint64(appId);
                resultCount++;
            }
        }

        // Resize array if needed
        if (resultCount < limit) {
            uint64[] memory resized = new uint64[](resultCount);
            for (uint256 i = 0; i < resultCount; i++) {
                resized[i] = result[i];
            }
            return resized;
        }

        return result;
    }

    /// @notice Get featured apps
    function getFeaturedApps(uint64 maxResults) external view returns (uint64[] memory) {
        uint256 limit = maxResults < featuredCount ? maxResults : featuredCount;
        uint64[] memory result = new uint64[](limit);

        for (uint256 i = 0; i < limit; i++) {
            result[i] = uint64(featuredApps[i]);
        }

        return result;
    }

    /// @notice Get apps by developer
    function getAppsByDeveloper(address developer, uint64 maxResults) external view returns (uint64[] memory) {
        uint64[] memory temp = new uint64[](maxResults);
        uint256 count = 0;

        for (uint256 i = 1; i < nextAppId && count < maxResults; i++) {
            if (appDevelopers[i] == developer) {
                temp[count] = uint64(i);
                count++;
            }
        }

        // Resize array
        uint64[] memory result = new uint64[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = temp[i];
        }

        return result;
    }

    /// @notice Get approved and active apps by category
    function getAppsByCategory(string calldata category, uint64 maxResults) external view returns (uint64[] memory) {
        uint64[] memory temp = new uint64[](maxResults);
        uint256 count = 0;

        for (uint256 i = 1; i < nextAppId && count < maxResults; i++) {
            if (appIsActive[i] && appIsApproved[i]) {
                if (keccak256(bytes(appCategories[i])) == keccak256(bytes(category))) {
                    temp[count] = uint64(i);
                    count++;
                }
            }
        }

        // Resize array
        uint64[] memory result = new uint64[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = temp[i];
        }

        return result;
    }

    /// @notice Get approved and active apps by chain ID
    function getAppsByChain(uint64 chainId, uint64 maxResults) external view returns (uint64[] memory) {
        uint64[] memory temp = new uint64[](maxResults);
        uint256 count = 0;

        for (uint256 i = 1; i < nextAppId && count < maxResults; i++) {
            if (appIsActive[i] && appIsApproved[i] && appChainIds[i] == chainId) {
                temp[count] = uint64(i);
                count++;
            }
        }

        // Resize array
        uint64[] memory result = new uint64[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = temp[i];
        }

        return result;
    }

    /// @notice Get all approved and active apps
    function getAllApps(uint64 maxResults) external view returns (uint64[] memory) {
        uint64[] memory temp = new uint64[](maxResults);
        uint256 count = 0;

        for (uint256 i = 1; i < nextAppId && count < maxResults; i++) {
            if (appIsActive[i] && appIsApproved[i]) {
                temp[count] = uint64(i);
                count++;
            }
        }

        // Resize array
        uint64[] memory result = new uint64[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = temp[i];
        }

        return result;
    }

    /// @notice Check if an address is an admin
    function isAdmin(address addr) external view returns (bool) {
        return admins[addr];
    }

    /// @notice Get the contract owner
    function getOwner() external view returns (address) {
        return owner;
    }

    /// @notice Get total number of apps registered
    function getTotalApps() external view returns (uint64) {
        return nextAppId > 0 ? uint64(nextAppId - 1) : 0;
    }
}
