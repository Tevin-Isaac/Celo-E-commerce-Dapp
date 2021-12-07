// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Marketplace {

    uint internal productsLength = 0;
    
    //  address of the cusd token
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    
    // admin address
    address ownerAddress;

// struct containing product data
    struct Product {
        address payable owner;
        string name;
        string image;
        string description;
        string location;
        string category;
        uint price;
        uint sales;
        uint pending;
        
    }

// map product struck to an integer
    mapping (uint => Product) internal products;
    
    // event to e triggered when product is ordered
    event ProductOrdered (
        address _from,
        uint ProductId
    );
    
    // admin modifier
    modifier isAdmin(){
        require(msg.sender == ownerAddress, "You are not an admin");
        _;
    }
    
    
    // constructor
    constructor(){
        ownerAddress = msg.sender;
    }
    
    


// save a particular product to the blockchain
    function setProduct(
        string memory _name,
        string memory _image,
        string memory _description, 
        string memory _location,
        string memory _category,
        uint _price
        uint _pending
    ) public {
     
        require(_price > 0, "Please enter a valid price");
        
        products[productsLength] = Product(
            payable(msg.sender),
            _name,
            _image,
            _description,
            _location,
            _category,
            _price,
            0,  
            _pending
        );
        productsLength++;
    }

// get a particular product
    function getProduct(uint _index) public view returns (
        address payable,
        string memory, 
        string memory, 
        string memory, 
        string memory,
        string memory,
        uint, 
        uint,
        uint
    ) {
        Product storage product = products[_index];
        return (
            product.owner,
            product.name, 
            product.image, 
            product.description, 
            product.location, 
            product.category,
            product.price,
            product.sales,
            product.pending
            
        );
    }
    
    // order a product

    function orderProduct(uint _index) public payable  {
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            products[_index].owner,
            products[_index].price
          ),
          "Transfer failed."
        );
        products[_index].sales++;
        emit ProductOrdered(msg.sender, _index);
    }
    
    // get product length
    function getProductOrdersLength() public view returns (uint) {
        return (productsLength);
    }
}
