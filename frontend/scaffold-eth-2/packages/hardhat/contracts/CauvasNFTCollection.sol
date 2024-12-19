// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract CauvasNFTCollection is ERC721URIStorage, AccessControl, Ownable {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  uint256 private _tokenIds;
  mapping(address => bool) public minterToCopyrightAgreement;
  mapping(uint256 => Auction) public idToAuction;
  string public constant COPYRIGHT_AGREEMENT_CID = "";

  struct Auction {
    uint256 tokenId;
    uint256 startingPrice;
    uint256 highestBid;
    address payable highestBidder;
    uint256 endTime;
    bool ended;
  }

  event CopyrightAgreementSigned(address indexed minter);
  event AuctionCreated(uint256 indexed tokenId, uint256 startingPrice, uint256 endTime);
  event HighestBidIncreased(uint256 indexed tokenId, address bidder, uint256 amount);
  event AuctionEnded(uint256 indexed tokenId, address winner, uint256 amount);

  constructor() ERC721("Cauvas Tokens", "CVT") Ownable(msg.sender) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(MINTER_ROLE, msg.sender);
  }

  function giveMinterRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _grantRole(MINTER_ROLE, account);
  }

  function revokeMinterRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _revokeRole(MINTER_ROLE, account);
  }

  function hasMinterRole(address account) external view returns (bool) {
    return hasRole(MINTER_ROLE, account);
  }

  function hasAdminRole(address account) external view returns (bool) {
    return hasRole(DEFAULT_ADMIN_ROLE, account);
  }

  function getTokenIds() external view returns (uint256) {
    return _tokenIds;
  }

  function signCopyrightAgreement() external onlyRole(MINTER_ROLE) {
    require(!minterToCopyrightAgreement[msg.sender], "Agreement already signed");

    minterToCopyrightAgreement[msg.sender] = true;

    emit CopyrightAgreementSigned(msg.sender);
  }

  function createToken(string memory tokenURI) external onlyRole(MINTER_ROLE) returns (uint256) {
    require(minterToCopyrightAgreement[msg.sender], "Copyright agreement must be signed");

    uint256 newTokenId = _tokenIds;
    _tokenIds++;

    _safeMint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, tokenURI);

    // Transfer the NFT to this contract
    _transfer(msg.sender, address(this), newTokenId);

    _revokeRole(MINTER_ROLE, msg.sender);

    return newTokenId;
  }

  function createAuction(uint256 tokenId, uint256 startingPrice, uint256 duration) external onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 endTime = block.timestamp + duration;

    idToAuction[tokenId] = Auction({
      tokenId: tokenId,
      startingPrice: startingPrice,
      highestBid: 0,
      highestBidder: payable(address(0)),
      endTime: endTime,
      ended: false
    });

    emit AuctionCreated(tokenId, startingPrice, endTime);
  }

  function bid(uint256 tokenId) external payable {
    Auction storage auction = idToAuction[tokenId];
    require(block.timestamp < auction.endTime, "Auction already ended");
    require(msg.value >= auction.startingPrice, "Bid must be at least the starting price");
    require(msg.value > auction.highestBid, "There already is a higher bid");

    if (auction.highestBid != 0) {
      auction.highestBidder.transfer(auction.highestBid);
    }

    auction.highestBid = msg.value;
    auction.highestBidder = payable(msg.sender);

    emit HighestBidIncreased(tokenId, msg.sender, msg.value);
  }

  function endAuction(uint256 tokenId) external {
    Auction storage auction = idToAuction[tokenId];
    require(block.timestamp >= auction.endTime, "Auction not yet ended");
    require(!auction.ended, "Auction end has already been called");

    auction.ended = true;

    if (auction.highestBidder != address(0)) {
      _transfer(address(this), auction.highestBidder, tokenId);
    } else {
      _transfer(address(this), owner(), tokenId);
    }

    emit AuctionEnded(tokenId, auction.highestBidder, auction.highestBid);
  }

  function fetchAuctionItems() external view returns (Auction[] memory) {
    uint256 itemCount = _tokenIds;
    uint256 unsoldItemCount = 0;
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < itemCount; i++) {
      if (!idToAuction[i].ended) {
        unsoldItemCount++;
      }
    }

    Auction[] memory items = new Auction[](unsoldItemCount);

    for (uint256 i = 0; i < itemCount; i++) {
      if (!idToAuction[i].ended) {
        items[currentIndex] = idToAuction[i];
        currentIndex++;
      }
    }
    return items;
  }

  function fetchMyNFTUrisAndIds() external view returns (string[] memory, uint256[] memory) {
    uint256 totalItemCount = _tokenIds;
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToAuction[i].ended && idToAuction[i].highestBidder == msg.sender) {
        itemCount++;
      }
    }

    string[] memory uris = new string[](itemCount);
    uint256[] memory tokenIds = new uint256[](itemCount);

    // Second pass to populate the arrays
    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToAuction[i].ended && idToAuction[i].highestBidder == msg.sender) {
        uris[currentIndex] = tokenURI(i);
        tokenIds[currentIndex] = i;
        currentIndex++;
      }
    }

    return (uris, tokenIds);
  }

  function getURIs() external view returns (string[] memory) {
    uint256 totalTokenCount = _tokenIds;
    string[] memory uris = new string[](totalTokenCount);

    for (uint256 i = 0; i < totalTokenCount; i++) {
        uris[i] = tokenURI(i);
    }

    return uris;
  }


    function sendAuctionEarnings(uint256 tokenId, address payable to) external onlyRole(DEFAULT_ADMIN_ROLE) {
    Auction storage auction = idToAuction[tokenId];
    require(auction.ended, "Auction not yet ended");
    require(auction.highestBid > 0, "No funds to withdraw");

    uint256 amount = auction.highestBid;
    auction.highestBid = 0;

    to.transfer(amount);
    }


  function supportsInterface(bytes4 interfaceId)
      public
      view
      override(ERC721URIStorage, AccessControl)
      returns (bool)
  {
      return super.supportsInterface(interfaceId);
  }
}
