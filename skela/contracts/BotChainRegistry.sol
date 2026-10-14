// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BotChainRegistry
 * @dev User registration, .bot name binding, and profile lookup for SKELA on BOT Chain.
 * Compatible with EVM & BOT Chain's ERC-8004 Agent Identity.
 */
contract BotChainRegistry {
    struct UserProfile {
        string username;
        uint256 registeredAt;
        bool isAgent;
        string agentMetadataUri;
    }

    // Mapping from user address to profile
    mapping(address => UserProfile) public users;
    // Mapping from username (.bot) to owner address
    mapping(string => address) public usernameToAddress;
    // Total registered users
    uint256 public userCount;

    // Events
    event UserRegistered(address indexed user, string username, bool isAgent, uint256 registeredAt);
    event AgentMetadataUpdated(address indexed agent, string metadataUri);

    error AlreadyRegistered();
    error UsernameTaken();
    error EmptyUsername();

    /**
     * @notice Register sender with a unique .bot username
     * @param username The desired username (e.g., "ayo" for "ayo.bot")
     */
    function register(string calldata username) external {
        if (bytes(username).length == 0) revert EmptyUsername();
        if (users[msg.sender].registeredAt != 0) revert AlreadyRegistered();
        if (usernameToAddress[username] != address(0)) revert UsernameTaken();

        users[msg.sender] = UserProfile({
            username: username,
            registeredAt: block.timestamp,
            isAgent: false,
            agentMetadataUri: ""
        });
        usernameToAddress[username] = msg.sender;
        userCount++;

        emit UserRegistered(msg.sender, username, false, block.timestamp);
    }

    /**
     * @notice Register an AI Agent profile conforming to ERC-8004 Agent OS metadata
     */
    function registerAgent(string calldata username, string calldata metadataUri) external {
        if (bytes(username).length == 0) revert EmptyUsername();
        if (users[msg.sender].registeredAt != 0) revert AlreadyRegistered();
        if (usernameToAddress[username] != address(0)) revert UsernameTaken();

        users[msg.sender] = UserProfile({
            username: username,
            registeredAt: block.timestamp,
            isAgent: true,
            agentMetadataUri: metadataUri
        });
        usernameToAddress[username] = msg.sender;
        userCount++;

        emit UserRegistered(msg.sender, username, true, block.timestamp);
    }

    function getUser(address addr) external view returns (UserProfile memory) {
        return users[addr];
    }

    function resolveUsername(string calldata username) external view returns (address) {
        return usernameToAddress[username];
    }

    function isRegistered(address addr) external view returns (bool) {
        return users[addr].registeredAt != 0;
    }

    function getUserCount() external view returns (uint256) {
        return userCount;
    }
}
