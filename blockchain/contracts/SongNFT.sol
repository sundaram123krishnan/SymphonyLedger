// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SongNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Struct to store stakeholder info
    struct Stakeholder {
        address payable wallet;
        uint256 sharePercentage; // Out of 10000 (100.00%)
    }

    // Mapping from token ID to stakeholders array
    mapping(uint256 => Stakeholder[]) public songStakeholders;

    // Mapping from token ID to song metadata
    struct SongMetadata {
        string title;
        string artist;
        string ipfsHash; // IPFS hash of the MP3,
        string metadataURI;
        uint256 mintPrice;
        bool exists;
    }
    mapping(uint256 => SongMetadata) public songs;

    // Events
    event SongMinted(uint256 tokenId, address buyer, string ipfsHash);
    event RoyaltiesDistributed(uint256 tokenId, uint256 amount);

    constructor() ERC721("Music NFT", "MNFT") Ownable(msg.sender) {}

    function getNextTokenId() public view returns (uint256) {
        return _nextTokenId;
    }

    function songExists(uint256 tokenId) public view returns (bool) {
        return songs[tokenId].exists;
    }

    function createSong(
        string memory title,
        string memory artist,
        string memory ipfsHash,
        string memory metadataURI,
        uint256 mintPrice,
        address payable[] memory stakeholderAddresses,
        uint256[] memory sharePercentages
    ) public onlyOwner returns (uint256) {
        require(
            stakeholderAddresses.length == sharePercentages.length,
            "Arrays must be same length"
        );

        // Validate total shares equal 100%
        uint256 totalShares = 0;
        for (uint256 i = 0; i < sharePercentages.length; i++) {
            totalShares += sharePercentages[i];
        }
        require(totalShares == 10000, "Total shares must equal 100%");

        uint256 tokenId = _nextTokenId++;

        // Store song metadata
        songs[tokenId] = SongMetadata(
            title,
            artist,
            ipfsHash,
            metadataURI,
            mintPrice,
            true // mark as existing
        );

        // Store stakeholders
        for (uint256 i = 0; i < stakeholderAddresses.length; i++) {
            songStakeholders[tokenId].push(
                Stakeholder(stakeholderAddresses[i], sharePercentages[i])
            );
        }

        _setTokenURI(tokenId, metadataURI);

        return tokenId;
    }

    function mintSong(uint256 tokenId) public payable {
        require(songExists(tokenId), "Song does not exist");
        require(msg.value >= songs[tokenId].mintPrice, "Insufficient payment");

        // Distribute royalties to stakeholders
        distributeRoyalties(tokenId, msg.value);

        _safeMint(msg.sender, tokenId);

        emit SongMinted(tokenId, msg.sender, songs[tokenId].ipfsHash);
    }

    function distributeRoyalties(uint256 tokenId, uint256 amount) private {
        Stakeholder[] memory stakeholders = songStakeholders[tokenId];

        for (uint256 i = 0; i < stakeholders.length; i++) {
            uint256 royaltyAmount = (amount * stakeholders[i].sharePercentage) /
                10000;
            stakeholders[i].wallet.transfer(royaltyAmount);
        }

        emit RoyaltiesDistributed(tokenId, amount);
    }

    function getSongMetadata(
        uint256 tokenId
    )
        public
        view
        returns (
            string memory title,
            string memory artist,
            string memory ipfsHash,
            string memory metadataURI,
            uint256 mintPrice
        )
    {
        require(songExists(tokenId), "Song does not exist");
        SongMetadata memory song = songs[tokenId];
        return (song.title, song.artist, song.ipfsHash, song.metadataURI, song.mintPrice);
    }

    function getStakeholders(
        uint256 tokenId
    )
        public
        view
        returns (address[] memory addresses, uint256[] memory shares)
    {
        require(songExists(tokenId), "Song does not exist");

        Stakeholder[] memory stakeholders = songStakeholders[tokenId];
        addresses = new address[](stakeholders.length);
        shares = new uint256[](stakeholders.length);

        for (uint256 i = 0; i < stakeholders.length; i++) {
            addresses[i] = stakeholders[i].wallet;
            shares[i] = stakeholders[i].sharePercentage;
        }

        return (addresses, shares);
    }
}
