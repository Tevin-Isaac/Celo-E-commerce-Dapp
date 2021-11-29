import React, { Component } from 'react';
import Products from './components/Products';
import Filter from './components/Filter';
import Basket from './components/Basket';


import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = { size: '', sort: '', cartItems: [], products: [], filteredProducts: [] };
  }
  componentWillMount() {

    if (localStorage.getItem('cartItems')) {
      this.setState({ cartItems: JSON.parse(localStorage.getItem('cartItems')) });
    }

    fetch('http://localhost:8000/products').then(res => res.json())
      .catch(err => fetch('db.json').then(res => res.json()).then(data => data.products))
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
          <img src="https://media-exp1.licdn.com/dms/image/C4D03AQFLh0LGciljLw/profile-displayphoto-shrink_800_800/0/1635256014189?e=1643846400&v=beta&t=kNZpdbhSD8VyJa9JTyHADK5Ud7derJvHUdcWB59dPSY" />
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