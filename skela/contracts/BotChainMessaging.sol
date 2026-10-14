// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IBotChainRegistry {
    function isRegistered(address addr) external view returns (bool);
}

interface IBotChainGroups {
    function isMember(uint256 groupId, address addr) external view returns (bool);
}

/**
 * @title BotChainMessaging
 * @dev On-chain pointers for E2E-encrypted DMs & group messages, plus public GM Board.
 * Optimized for BOT Chain's high throughput (~0.75s blocks) and ultra-low gas costs.
 */
contract BotChainMessaging {
    IBotChainRegistry public registry;
    IBotChainGroups public groupsContract;

    struct MessagePointer {
        address sender;
        address recipient;
        string storagePointer; // IPFS CID, Arweave hash, or BOT Chain Blob ref
        bytes32 contentHash;    // Keccak256 hash of plaintext/ciphertext
        uint256 timestamp;
        uint256 blockNumber;
        bool isGroup;
        uint256 groupId;
    }

    struct GMPost {
        uint256 id;
        address author;
        string message;
        uint256 blockNumber;
        uint256 timestamp;
    }

    uint256 public messageCounter;
    uint256 public gmCounter;

    mapping(uint256 => MessagePointer) public messagePointers;
    mapping(uint256 => GMPost) public gmPosts;

    event MessageSent(
        uint256 indexed id,
        address indexed sender,
        address indexed recipient,
        string storagePointer,
        bytes32 contentHash
    );

    event GroupMessageSent(
        uint256 indexed id,
        uint256 indexed groupId,
        address indexed sender,
        string storagePointer,
        bytes32 contentHash
    );

    event GMPosted(
        uint256 indexed id,
        address indexed author,
        string message,
        uint256 blockNumber,
        uint256 timestamp
    );

    error RecipientNotRegistered();
    error NotGroupMember();
    error EmptyMessage();
    error MessageTooLong();

    constructor(address _registry, address _groups) {
        registry = IBotChainRegistry(_registry);
        groupsContract = IBotChainGroups(_groups);
    }

    function setContracts(address _registry, address _groups) external {
        if (address(registry) == address(0)) registry = IBotChainRegistry(_registry);
        if (address(groupsContract) == address(0)) groupsContract = IBotChainGroups(_groups);
    }

    /**
     * @notice Send a direct message pointer
     */
    function sendMessage(
        address recipient,
        string calldata storagePointer,
        bytes32 contentHash
    ) external returns (uint256) {
        if (address(registry) != address(0)) {
            if (!registry.isRegistered(recipient)) revert RecipientNotRegistered();
        }

        uint256 newId = ++messageCounter;
        messagePointers[newId] = MessagePointer({
            sender: msg.sender,
            recipient: recipient,
            storagePointer: storagePointer,
            contentHash: contentHash,
            timestamp: block.timestamp,
            blockNumber: block.number,
            isGroup: false,
            groupId: 0
        });

        emit MessageSent(newId, msg.sender, recipient, storagePointer, contentHash);
        return newId;
    }

    /**
     * @notice Send a group message pointer
     */
    function sendGroupMessage(
        uint256 groupId,
        string calldata storagePointer,
        bytes32 contentHash
    ) external returns (uint256) {
        if (address(groupsContract) != address(0)) {
            if (!groupsContract.isMember(groupId, msg.sender)) revert NotGroupMember();
        }

        uint256 newId = ++messageCounter;
        messagePointers[newId] = MessagePointer({
            sender: msg.sender,
            recipient: address(0),
            storagePointer: storagePointer,
            contentHash: contentHash,
            timestamp: block.timestamp,
            blockNumber: block.number,
            isGroup: true,
            groupId: groupId
        });

        emit GroupMessageSent(newId, groupId, msg.sender, storagePointer, contentHash);
        return newId;
    }

    /**
     * @notice Post to the public GM Board (max 140 chars)
     */
    function postGM(string calldata message) external returns (uint256) {
        bytes memory msgBytes = bytes(message);
        if (msgBytes.length == 0) revert EmptyMessage();
        if (msgBytes.length > 140) revert MessageTooLong();

        uint256 newId = ++gmCounter;
        gmPosts[newId] = GMPost({
            id: newId,
            author: msg.sender,
            message: message,
            blockNumber: block.number,
            timestamp: block.timestamp
        });

        emit GMPosted(newId, msg.sender, message, block.number, block.timestamp);
        return newId;
    }

    function getMessage(uint256 id) external view returns (MessagePointer memory) {
        return messagePointers[id];
    }

    function getGM(uint256 id) external view returns (GMPost memory) {
        return gmPosts[id];
    }

    function getMessageCount() external view returns (uint256) {
        return messageCounter;
    }

    function getGMCount() external view returns (uint256) {
        return gmCounter;
    }

    function getRecentGMs(uint256 limit) external view returns (GMPost[] memory) {
        uint256 count = limit > gmCounter ? gmCounter : limit;
        GMPost[] memory recent = new GMPost[](count);
        for (uint256 i = 0; i < count; i++) {
            recent[i] = gmPosts[gmCounter - i];
        }
        return recent;
    }
}
