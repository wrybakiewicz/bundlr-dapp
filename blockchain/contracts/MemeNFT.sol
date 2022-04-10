//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MemeNFT is ERC721Enumerable, ERC721URIStorage {

    enum Vote{NO_VOTE, UP, DOWN}

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(address => mapping(uint => Vote)) addressTokenIdVotes;

    event VoteUp(address indexed voter, uint indexed tokenId);
    event VoteDown(address indexed voter, uint indexed tokenId);

    constructor() ERC721("MemeNFT", "MNFT") {}

    function mint(string memory _tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        return newItemId;
    }

    function voteUp(uint _tokenId) public {
        addressTokenIdVotes[msg.sender][_tokenId] = Vote.UP;
        emit VoteUp(msg.sender, _tokenId);
    }

    function voteDown(uint _tokenId) public {
        addressTokenIdVotes[msg.sender][_tokenId] = Vote.DOWN;
        emit VoteDown(msg.sender, _tokenId);
    }

    function getAddressTokenIdVote(address _voter, uint _tokenId) public view returns (Vote) {
        return addressTokenIdVotes[_voter][_tokenId];
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}
