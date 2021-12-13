import React, { useState, useEffect,} from "react";
import { BrowserRouter as Router } from "react-router-dom";

import GlobalStyles from "./Globalstyles";
import { MainContent,Navbar, Footer,Orders} from "./components";
import { HistoryOrder} from "./components";
import {  Add } from "./components";

import './index.css';
import Web3 from "web3"
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import marketplaceAbi from "./contract/marketplace.abi.json";
import erc20 from "./contract/erc20.abi.json";



const ERC20_DECIMALS = 18
const ContractAddress = "0x6A170D415077212E54D2a7cd67a79551C7E5c078"
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"

function App() {
  const [celoBalance, setCeloBalance] = useState(0);
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [products,setProducts] = useState([]);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  

  const connectCeloWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];

        kit.defaultAccount = user_address;

         setAddress(user_address);
        console.log(user_address);
         setProducts(products);
        console.log(products);

        setKit(kit);
        console.log(kit)

        // web3 events
        let options = {
          fromBlock: 0,
          address: ["0x18C242bC84905bb91ce89AD36fe07CddF52eb242"], //Only get events from specific addresses
          topics: [], //What topics to subscribe to
        };

        let subscription = web3.eth.subscribe("logs", options, (err, event) => {
          if (!err) console.log(event);
        });

        subscription.on('data', event => {
          if (contract) {
          getProducts()
          }
        })


      } catch (error) {
        console.log("There is an error");
        console.log({ error });
      }
    } else {
      console.log("please install the extension");
    }
  };

  useEffect(() => {
    connectCeloWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      return getBalance();
    } else {
      console.log("no kit or address");
    }
  }, [kit, address]);

  useEffect(() => {
    if (contract) {
      getProducts();
    }
  }, [contract]);

  const getBalance = async () => {
    const balance = await kit.getTotalBalance(address);
    const celoBalance = balance.CELO.shiftedBy(-ERC20_DECIMALS).toFixed(2);
    const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

    const contract = new kit.web3.eth.Contract(marketplaceAbi, ContractAddress);

    setcontract(contract);
    setCeloBalance(celoBalance);
    setcUSDBalance(USDBalance);
  };
  

  const getProducts = async function () {
    let _productsLength = await contract.methods.getProductOrdersLength().call();
    let _products = [];
    for (let i = 0; i < _productsLength; i++) {
      let _product = new Promise(async (resolve, reject) => {
        let p = await contract.methods.getProduct(i).call();
        resolve({
          index: i,
          owner: p[0],
          name: p[1],
          image: p[2],
          description: p[3],
          location: p[4],
          category: p[5],
          price: new BigNumber(p[6]),
          sold: p[7],
          pending: p[8],
        });
      });
      _products.push(_product);
    }
    const products = await Promise.all(_products);
    products(products);
  };
  
   

  // function to add product
  const addProduct = async (
    _name,
    _image,
    _description,
    _location,
    _category,
    _pending,
    _price
    
  ) => {
    try {
      const price = new BigNumber(_price).shiftedBy(ERC20_DECIMALS).toString();

      await contract.methods
        .setProduct(
          _name,
          _image,
          _description,
          _location,
          _category,
          price,
          _pending
        )
        .send({ from: address });
      getProducts();
    } catch (error) {
      console.log(error);
    }
  };

  // function to initiate transaction
  const orderProduct = async (_price, _index) => {
    try {
      const cUSDContract = new kit.web3.eth.Contract(
        erc20,
        cUSDContractAddress
      );
      const cost = new BigNumber(_price).shiftedBy(ERC20_DECIMALS).toString();

      await cUSDContract.methods
        .approve(ContractAddress, cost)
        .send({ from: address });

      await contract.methods.orderProduct(_index).send({ from: address });

      getBalance();
      getProducts();
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Router>
      <GlobalStyles />
      <MainContent
        cUSDBalance={cUSDBalance}
        celoBalance={celoBalance}
        address={address}
        connectCeloWallet={connectCeloWallet}
      />
       <Orders products={products} orderProducts={orderProduct} />
       <Add addProducts={addProduct} />
       <HistoryOrder products={products} />
      <Navbar/>
      <Footer
        cUSDBalance={cUSDBalance}
        celoBalance={celoBalance}
        address={address}
        connectCeloWallet={connectCeloWallet}
      />
    </Router>
  );
}

export default App;