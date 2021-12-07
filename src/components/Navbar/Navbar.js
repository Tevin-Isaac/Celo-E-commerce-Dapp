import React, {useState, useEffect} from 'react';


const Navbar = props => {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const handleClick = () => setClick(!click);

    const showButton = () =>{
        if(window.innerWidth<= 1000){
            setButton(false);
        }else{
            setButton(true);
        }
    }

    useEffect(() => {
        showButton();
    }, []);
    window.addEventListener('resize', showButton);
    return (
        <div>
            <div>
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
          
        </div>
        </div>

    )
}

export default Navbar;
