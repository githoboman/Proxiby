// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IERC8004
 * @dev Interface for ERC-8004 compliant AI Agent Identity on BOT Chain.
 * Enables AI Agents to register verifiable on-chain identity,
 * bind smart account wallets (ERC-4337), and publish agent capabilities.
 */
interface IERC8004 {
    event AgentRegistered(uint256 indexed agentId, address indexed owner, address indexed walletAddress, string metadataUri);
    event AgentWalletBound(uint256 indexed agentId, address indexed walletAddress);
    event AgentMetadataUpdated(uint256 indexed agentId, string metadataUri);

    function register(
        address owner,
        address walletAddress,
        string calldata metadataUri
    ) external returns (uint256 agentId);

    function bindWallet(uint256 agentId, address walletAddress) external;

    function getAgent(uint256 agentId) external view returns (
        address owner,
        address walletAddress,
        string memory metadataUri,
        bool active
    );

    function getAgentByWallet(address walletAddress) external view returns (uint256 agentId);
}
