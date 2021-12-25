// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

// use these imports if using Remix, otherwise use the GitHub links
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol"; 

/**This contract implements basic ERC721 NFT functionality with auto-incremented token ID's and a method
 * for storing a base URI for off-chain metadata using the format baseURI + "/" + _tokenIdCounter
 * 
 * Provide the metadata variable in the constructor in protobuf encoded bytes format.
 **/
contract ERC721_metaphi is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    
    // Protobuf encoded representation of contract metadata.
    bytes metadata;

    constructor(string memory name, string memory ticker, bytes memory metadata) ERC721(name, ticker) {
        setMetadata(metadata);
    }

    function safeMint(address to) public onlyOwner {
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }
    
    function setMetadata(bytes memory metadata_) internal {
        metadata = metadata_;
    }
    
    function _baseURI() internal view override returns (string memory) {
        return string(metadata);
    }
    
    function getMetadata() public view returns (bytes memory) {
        return metadata;
    }
}
