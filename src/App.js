import React, { Component } from 'react';
import Products from './components/Products';
import Filter from './components/Filter';
import Basket from './components/Basket';
import Web3 from "web3"
import { newKitFromWeb3 } from "@celo/contractkit"
import BigNumber from "bignumber.js"
import marketplaceAbi from "./contract/marketplace.abi.json"
import erc20Abi from "./contract/erc20.abi.json"
import './App.css';

const ERC20_DECIMALS = 18
const MPContractAddress = "0x6A170D415077212E54D2a7cd67a79551C7E5c078"
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"

let kit
let contract
let products = []

const connectCeloWallet = async function () {
  if (window.celo) {
    notification("⚠️ Please approve this DApp to use it.")
    try {
      await window.celo.enable()
      notificationOff()

      const web3 = new Web3(window.celo)
      kit = newKitFromWeb3(web3)

      const accounts = await kit.web3.eth.getAccounts()
      kit.defaultAccount = accounts[0]

      contract = new kit.web3.eth.Contract(marketplaceAbi, MPContractAddress)
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
  } else {
    notification("⚠️ Please install the CeloExtensionWallet.")
  }
}

async function approve(_price) {
  const cUSDContract = new kit.web3.eth.Contract(erc20Abi, cUSDContractAddress)

  const result = await cUSDContract.methods
    .approve(MPContractAddress, _price)
    .send({ from: kit.defaultAccount })
  return result
}

const getBalance = async function () {
  const totalBalance = await kit.getTotalBalance(kit.defaultAccount)
  const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2)
  document.querySelector("#balance").textContent = cUSDBalance
}

const getProducts = async function() {
  const _productsLength = await contract.methods.getProductsLength().call()
  const _products = []
  for (let i = 0; i < _productsLength; i++) {
    let _product = new Promise(async (resolve, reject) => {
      let p = await contract.methods.readProduct(i).call()
      resolve({
        index: i,
        owner: p[0],
        name: p[1],
        image: p[2],
        description: p[3],
        location: p[4],
        price: new BigNumber(p[5]),
        sold: p[6],
      })
    })
    _products.push(_product)
  }
  products = await Promise.all(_products)
  renderProducts()
}

function renderProducts() {
  document.getElementById("marketplace").innerHTML = ""
  products.forEach((_product) => {
    const newDiv = document.createElement("div")
    newDiv.className = "col-md-4"
    newDiv.innerHTML = productTemplate(_product)
    document.getElementById("marketplace").appendChild(newDiv)
  })
}

function productTemplate(_product) {
  return `
    <div class="card mb-4">
      <img class="card-img-top" src="${_product.image}" alt="...">
      <div class="position-absolute top-0 end-0 bg-warning mt-4 px-2 py-1 rounded-start">
        ${_product.sold} Sold
      </div>
      <div class="card-body text-left p-4 position-relative">
        <div class="translate-middle-y position-absolute top-0">
        ${identiconTemplate(_product.owner)}
        </div>
        <h2 class="card-title fs-4 fw-bold mt-2">${_product.name}</h2>
        <p class="card-text mb-4" style="min-height: 82px">
          ${_product.description}             
        </p>
        <p class="card-text mt-4">
          <i class="bi bi-geo-alt-fill"></i>
          <span>${_product.location}</span>
        </p>
        <div class="d-grid gap-2">
          <a class="btn btn-lg btn-outline-dark buyBtn fs-6 p-3" id=${
            _product.index
          }>
            Buy for ${_product.price.shiftedBy(-ERC20_DECIMALS).toFixed(2)} cUSD
          </a>
        </div>
      </div>
    </div>
  `
}

function identiconTemplate(_address) {
  const icon = "any"
    .create({
      seed: _address,
      size: 8,
      scale: 16,
    })
    .toDataURL()

  return `
  <div class="rounded-circle overflow-hidden d-inline-block border border-white border-2 shadow-sm m-0">
    <a href="https://alfajores-blockscout.celo-testnet.org/address/${_address}/transactions"
        target="_blank">
        <img src="${icon}" width="48" alt="${_address}">
    </a>
  </div>
  `
}

function notification(_text) {
  document.querySelector(".alert").style.display = "block"
  document.querySelector("#notification").textContent = _text
}

function notificationOff() {
  document.querySelector(".alert").style.display = "none"
}

window.addEventListener("load", async () => {
  notification("⌛ Loading...")
  await connectCeloWallet()
  await getBalance()
  await getProducts()
  notificationOff()
});

document
  .querySelector("#newProductBtn")
  .addEventListener("click", async (e) => {
    const params = [
      document.getElementById("newProductName").value,
      document.getElementById("newImgUrl").value,
      document.getElementById("newProductDescription").value,
      document.getElementById("newLocation").value,
      new BigNumber(document.getElementById("newPrice").value)
      .shiftedBy(ERC20_DECIMALS)
      .toString()
    ]
    notification(`⌛ Adding "${params[0]}"...`)
    try {
      const result = await contract.methods
        .writeProduct(...params)
        .send({ from: kit.defaultAccount })
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
    notification(`🎉 You successfully added "${params[0]}".`)
    getProducts()
  })

document.querySelector("#marketplace").addEventListener("click", async (e) => {
  if (e.target.className.includes("buyBtn")) {
    const index = e.target.id
    notification("⌛ Waiting for payment approval...")
    try {
      await approve(products[index].price)
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
    notification(`⌛ Awaiting payment for "${products[index].name}"...`)
    try {
      const result = await contract.methods
        .buyProduct(index)
        .send({ from: kit.defaultAccount })
      notification(`🎉 You successfully bought "${products[index].name}".`)
      getProducts()
      getBalance()
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
  }
})  

class App extends Component {
  constructor() {
    super();
    this.state = { size: '', sort: '', cartItems: [], products: [], filteredProducts: [] };
  }
  componentWillMount() {

    if (localStorage.getItem('cartItems')) {
      this.setState({ cartItems: JSON.parse(localStorage.getItem('cartItems')) });
    }

    fetch('http://localhost:3000/products').then(res => res.json())
      .catch(err => fetch('marketplace.abi.json').then(res => res.json()).then(data => data.products))
      .then(data => {
        this.setState({ products: data });
        this.listProducts();
      });
  }

  handleRemoveFromCart = (e, product) => {
    this.setState(state => {
      const cartItems = state.cartItems.filter(a => a.id !== product.id);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { cartItems: cartItems };
    })
  }

  handleAddToCart = (e, product) => {
    this.setState(state => {
      const cartItems = state.cartItems;
      let productAlreadyInCart = false;

      cartItems.forEach(cp => {
        if (cp.id === product.id) {
          cp.count += 1;
          productAlreadyInCart = true;
        }
      });

      if (!productAlreadyInCart) {
        cartItems.push({ ...product, count: 1 });
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { cartItems: cartItems };
    });
  }

  listProducts = () => {
    this.setState(state => {
      if (state.sort !== '') {
        state.products.sort((a, b) =>
          (state.sort === 'lowestprice'
            ? ((a.price > b.price) ? 1 : -1)
            : ((a.price < b.price) ? 1 : -1)));
      } else {
        state.products.sort((a, b) => (a.id > b.id) ? 1 : -1);
      }
      if (state.size !== '') {
        return { filteredProducts: state.products.filter(a => a.availableSizes.indexOf(state.size.toUpperCase()) >= 0) };
      }
      return { filteredProducts: state.products };
    })
  }
  handleSortChange = (e) => {
    this.setState({ sort: e.target.value });
    this.listProducts();
  }
  handleSizeChange = (e) => {
    this.setState({ size: e.target.value });
    this.listProducts();
  }

  render() {
    return (
      <><><div>
        <div className="navbar">
          <a className="active" href="#"><i className="fa fa-fw fa-home" /> Home</a>
          <a href="#"><i className="fa fa-fw fa-search" /> Search</a>
          <a href="#"><i className="fa fa-fw fa-envelope" /> Contact</a>
          <a href="#"><i className="fa fa-fw fa-user" /> Login</a>
          <a href="#"><i className="fa fa-fw fa-shopping-cart" /> Cart</a>
        </div>
        <div className="py-5 text-center text-white" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://c1.wallpaperflare.com/preview/693/266/521/clothing-shirt-retail-tee-shirt.jpg")', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: 'fit-content' }}>
          <div className="mask rgba-black-strong d-flex justify-content-center align-items-center">
            <div className="text-center white-text mx-5">
              <h1 className="mb-4">WELCOME TO SHOPINSKI</h1>
              <p className="mb-4">
                <strong>An e-commerce store that uses Celo Wallet for Payment</strong>
              </p>
              <p></p>
              <a target="_blank" href="https://github.com/Tevin-creator" className="btn btn-outline-light btn-lg">Place an Order</a>
            </div>
          </div>
        </div>
      </div><div className="container">
          <h1>Collection</h1>
          <hr />
          <div>
        <div className="alert alert-warning sticky-top mt-2" role="alert">
          <span id="notification">⌛ Loading...</span>
        </div>
        <div className="mb-4" style={{marginTop: '4em'}}>
          <a className="btn btn-dark rounded-pill" data-bs-toggle="modal" data-bs-target="#addModal">
            Add product
          </a>
        </div>
        <main id="marketplace" className="row" />
        {/*Modal*/}
        <div className="modal fade" id="addModal" tabIndex={-1} aria-labelledby="newProductModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="newProductModalLabel">New Product</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-row">
                    <div className="col">
                      <input type="text" id="newProductName" className="form-control mb-2" placeholder="Enter name of product" />
                    </div>
                    <div className="col">
                      <input type="text" id="newImgUrl" className="form-control mb-2" placeholder="Enter image url" />
                    </div>
                    <div className="col">
                      <input type="text" id="newProductDescription" className="form-control mb-2" placeholder="Enter product description" />
                    </div>
                    <div className="col">
                      <input type="text" id="newLocation" className="form-control mb-2" placeholder="Enter location" />
                    </div>
                    <div className="col">
                      <input type="text" id="newPrice" className="form-control mb-2" placeholder="Enter price" />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light border" data-bs-dismiss="modal">
                  Close
                </button>
                <button type="button" className="btn btn-dark" data-bs-dismiss="modal" id="newProductBtn">
                  Add product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
          <div className="row">
            <div className="col-md-9">
              <Filter count={this.state.filteredProducts.length} handleSortChange={this.handleSortChange}
                handleSizeChange={this.handleSizeChange} />
              <hr />
              <Products products={this.state.filteredProducts} handleAddToCart={this.handleAddToCart} />
            </div>
            <div className="col-md-3">
              <Basket cartItems={this.state.cartItems} handleRemoveFromCart={this.handleRemoveFromCart} />
            </div>

          </div>
          <div>
        <h4>Testomonial</h4>
        <div className="testimonial-quote group">
          <img src="https://hogg.utexas.edu/wp-content/uploads/2019/07/mia.png" />
          <div className="quote-container">
            <blockquote>
              <p>This is the best place to shop with your Celo Wallet”</p>
            </blockquote>
          </div></div></div>
          

        </div></><footer className="new_footer_area bg_color">
          <div className="new_footer_top">
            <div className="container">
              <div className="row">
                <div className="col-lg-3 col-md-6">
                  <div className="f_widget company_widget wow fadeInLeft" data-wow-delay="0.2s" style={{ visibility: 'visible', animationDelay: '0.2s', animationName: 'fadeInLeft' }}>
                    <h3 className="f-title f_600 t_color f_size_18">Get in Touch</h3>
                    <p>Don’t miss any updates!</p>
                    <form action="#" className="f_subscribe_two mailchimp" method="post" noValidate="true" _lpchecked={1}>
                      <input type="text" name="EMAIL" className="form-control memail" placeholder="Email" />
                      <button className="btn btn_get btn_get_two" type="submit">Subscribe</button>
                      <p className="mchimp-errmessage" style={{ display: 'none' }} />
                      <p className="mchimp-sucmessage" style={{ display: 'none' }} />
                    </form>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="f_widget about-widget pl_70 wow fadeInLeft" data-wow-delay="0.4s" style={{ visibility: 'visible', animationDelay: '0.4s', animationName: 'fadeInLeft' }}>
                    <h3 className="f-title f_600 t_color f_size_18">Download</h3>
                    <ul className="list-unstyled f_list">
                      <li><a href="#">Company</a></li>
                      <li><a href="#">About Us</a></li>
                      <li><a href="#">Terms of Service</a></li>
                   
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="f_widget about-widget pl_70 wow fadeInLeft" data-wow-delay="0.6s" style={{ visibility: 'visible', animationDelay: '0.6s', animationName: 'fadeInLeft' }}>
                    <h3 className="f-title f_600 t_color f_size_18">Help</h3>
                    <ul className="list-unstyled f_list">
                      <li><a href="#">FAQ</a></li>
                      <li><a href="#">Terms &amp; conditions</a></li>
                      <li><a href="#">Reporting</a></li>
                      <li><a href="#">Documentation</a></li>
                      <li><a href="#">Support Policy</a></li>
                      <li><a href="#">Privacy</a></li>
                    </ul>
                  </div>
                  
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="f_widget social-widget pl_70 wow fadeInLeft" data-wow-delay="0.8s" style={{ visibility: 'visible', animationDelay: '0.8s', animationName: 'fadeInLeft' }}>
                    <h3 className="f-title f_600 t_color f_size_18">Social Media</h3>
                    <div className="f_social_icon">
                      <a href="#" className="fab fa-facebook" />
                      <a href="#" className="fab fa-twitter" />
                      <a href="#" className="fab fa-linkedin" />
                      <a href="#" className="fab fa-pinterest" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer_bg">
              <div className="footer_bg_one" />
              <div className="footer_bg_two" />
            </div>
          </div>
          <div className="footer_bottom">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6 col-sm-7">
                  <p className="mb-0 f_400">©  2021 All rights reserved.</p>
                </div>
                <div className="col-lg-6 col-sm-5 text-right">
                  <p>Made with <i className="icon_heart" /> by <a href="#">Tevin Isaac</a></p>
                </div>
              </div>
            </div>
          </div>
        </footer></>
    );
  }
}

export default App;