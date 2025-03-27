// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SimpleERC721Marketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 private constant MAX_INT = type(uint256).max;

    struct TokenOnMarketplace {
        bool listing;
        uint256 price;
        uint256 royalty; // Phần trăm phí bản quyền (0 - 100)
        address publisher;
    }

    mapping(uint256 => TokenOnMarketplace) public marketplace;

    event Listed(uint256 indexed tokenId, uint256 price);
    event Unlisted(uint256 indexed tokenId);
    event Purchased(uint256 indexed tokenId, address buyer, uint256 price);

    constructor() ERC721("SimpleNFTToken", "SNT") {}

    /**
     * @dev Mint NFT mới và thêm vào danh sách marketplace
     * @param tokenURI URI metadata của NFT
     * @param royalty Phần trăm phí bản quyền (0 - 100)
     */
    function newItem(string memory tokenURI, uint256 royalty) public returns (uint256) {
        require(royalty <= 100, "newItem: Royalty cannot be more than 100%");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        marketplace[newItemId] = TokenOnMarketplace({
            listing: false,
            price: MAX_INT,
            royalty: royalty,
            publisher: msg.sender
        });

        return newItemId;
    }

    /**
     * @dev List NFT lên marketplace
     * @param _tokenId ID của NFT cần list
     * @param _price Giá bán NFT (tính bằng wei)
     */
    function listOnMarketplace(uint256 _tokenId, uint256 _price) public {
        require(_exists(_tokenId), "listOnMarketplace: Token does not exist");
        require(ownerOf(_tokenId) == msg.sender, "listOnMarketplace: Only owner can list the token");
        require(_price > 0, "listOnMarketplace: Price must be greater than zero");

        marketplace[_tokenId].listing = true;
        marketplace[_tokenId].price = _price;

        emit Listed(_tokenId, _price);
    }

    /**
     * @dev Hủy niêm yết NFT khỏi marketplace
     * @param _tokenId ID của NFT cần hủy niêm yết
     */
    function removeFromMarketplace(uint256 _tokenId) public {
        require(_exists(_tokenId), "removeFromMarketplace: Token does not exist");
        require(ownerOf(_tokenId) == msg.sender, "removeFromMarketplace: Only owner can unlist the token");

        marketplace[_tokenId].listing = false;
        marketplace[_tokenId].price = MAX_INT;

        emit Unlisted(_tokenId);
    }

    /**
     * @dev Mua NFT từ marketplace
     * @param _tokenId ID của NFT cần mua
     */
    function purchase(uint256 _tokenId) public payable {
        require(_exists(_tokenId), "purchase: Token does not exist");
        require(marketplace[_tokenId].listing, "purchase: Token is not listed for sale");
        require(msg.value == marketplace[_tokenId].price, "purchase: Incorrect price");

        address seller = ownerOf(_tokenId);
        address publisher = marketplace[_tokenId].publisher;
        uint256 royaltyFee = (msg.value * marketplace[_tokenId].royalty) / 100;

        // Chuyển tiền phí bản quyền cho người tạo NFT
        if (royaltyFee > 0) {
            payable(publisher).transfer(royaltyFee);
        }

        // Chuyển tiền còn lại cho người bán
        payable(seller).transfer(msg.value - royaltyFee);

        // Chuyển quyền sở hữu NFT
        _transfer(seller, msg.sender, _tokenId);

        // Xóa khỏi marketplace
        marketplace[_tokenId].listing = false;
        marketplace[_tokenId].price = MAX_INT;

        emit Purchased(_tokenId, msg.sender, msg.value);
    }

    /**
     * @dev Lấy thông tin marketplace của một NFT
     * @param _tokenId ID của NFT
     */
    function getMarketplaceInfo(uint256 _tokenId) public view returns (TokenOnMarketplace memory) {
        require(_exists(_tokenId), "getMarketplaceInfo: Token does not exist");
        return marketplace[_tokenId];
    }
}