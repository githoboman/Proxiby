// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BotChainGroups
 * @dev Group creation and membership management for SKELA on BOT Chain.
 */
contract BotChainGroups {
    uint256 public constant MAX_MEMBERS = 20;

    struct Group {
        uint256 id;
        string name;
        address creator;
        uint256 createdAt;
        uint256 blockNumber;
    }

    uint256 public groupCounter;

    mapping(uint256 => Group) public groups;
    mapping(uint256 => address[]) private groupMembers;
    mapping(uint256 => mapping(address => bool)) private isMemberOfGroup;
    mapping(address => uint256[]) private userGroups;

    event GroupCreated(uint256 indexed groupId, address indexed creator, string name);
    event MemberAdded(uint256 indexed groupId, address indexed member);
    event MemberRemoved(uint256 indexed groupId, address indexed member);
    event MemberLeft(uint256 indexed groupId, address indexed member);

    error GroupNotFound();
    error NotCreator();
    error GroupFull();
    error AlreadyMember();
    error NotMember();
    error EmptyName();
    error CreatorCannotLeave();

    function createGroup(string calldata name) external returns (uint256) {
        if (bytes(name).length == 0) revert EmptyName();

        uint256 newId = ++groupCounter;
        groups[newId] = Group({
            id: newId,
            name: name,
            creator: msg.sender,
            createdAt: block.timestamp,
            blockNumber: block.number
        });

        groupMembers[newId].push(msg.sender);
        isMemberOfGroup[newId][msg.sender] = true;
        userGroups[msg.sender].push(newId);

        emit GroupCreated(newId, msg.sender, name);
        emit MemberAdded(newId, msg.sender);

        return newId;
    }

    function addMember(uint256 groupId, address member) external {
        Group storage grp = groups[groupId];
        if (grp.createdAt == 0) revert GroupNotFound();
        if (msg.sender != grp.creator) revert NotCreator();
        if (isMemberOfGroup[groupId][member]) revert AlreadyMember();
        if (groupMembers[groupId].length >= MAX_MEMBERS) revert GroupFull();

        groupMembers[groupId].push(member);
        isMemberOfGroup[groupId][member] = true;
        userGroups[member].push(groupId);

        emit MemberAdded(groupId, member);
    }

    function removeMember(uint256 groupId, address member) external {
        Group storage grp = groups[groupId];
        if (grp.createdAt == 0) revert GroupNotFound();
        if (msg.sender != grp.creator) revert NotCreator();
        if (!isMemberOfGroup[groupId][member]) revert NotMember();
        if (member == grp.creator) revert CreatorCannotLeave();

        _removeMemberFromList(groupId, member);
        isMemberOfGroup[groupId][member] = false;

        emit MemberRemoved(groupId, member);
    }

    function leaveGroup(uint256 groupId) external {
        Group storage grp = groups[groupId];
        if (grp.createdAt == 0) revert GroupNotFound();
        if (!isMemberOfGroup[groupId][msg.sender]) revert NotMember();
        if (msg.sender == grp.creator) revert CreatorCannotLeave();

        _removeMemberFromList(groupId, msg.sender);
        isMemberOfGroup[groupId][msg.sender] = false;

        emit MemberLeft(groupId, msg.sender);
    }

    function getGroup(uint256 groupId) external view returns (Group memory) {
        return groups[groupId];
    }

    function getMembers(uint256 groupId) external view returns (address[] memory) {
        return groupMembers[groupId];
    }

    function isMember(uint256 groupId, address addr) external view returns (bool) {
        return isMemberOfGroup[groupId][addr];
    }

    function getUserGroups(address addr) external view returns (uint256[] memory) {
        return userGroups[addr];
    }

    function getGroupCount() external view returns (uint256) {
        return groupCounter;
    }

    function _removeMemberFromList(uint256 groupId, address member) internal {
        address[] storage members = groupMembers[groupId];
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == member) {
                members[i] = members[members.length - 1];
                members.pop();
                break;
            }
        }
    }
}
