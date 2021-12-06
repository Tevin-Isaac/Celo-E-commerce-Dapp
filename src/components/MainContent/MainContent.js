import Navbar from '../Navbar/Navbar';
import {Button} from '../../Globalstyles';
import {
    MainContentContainer,
    MainContentElement,
    MainContentElementText,
    MainContentTitle,
    MainContentTitleText,
    MainContentText,
    MainContentBtn,

} from './MainContent.styles';

const MainContent = props =>{
    return(
        <><div>
            <MainContentContainer>
                <Navbar cUSDBalance={props.cUSDBalance} celoBalance={props.celoBalance} address={props.address}
                    connectCeloWallet={props.connectCeloWallet} />
                <MainContentElement>
                    <MainContentElementText>
                        <MainContentTitle>
                            <MainContentTitleText>Product</MainContentTitleText>
                            <MainContentTitleText>For you all day</MainContentTitleText>
                        </MainContentTitle>
                        <MainContentText>
                            Discover, Order Product, Add Product
                        </MainContentText>
                        <MainContentBtn>
                            <Button primary bigFont>Set Delivery</Button>
                        </MainContentBtn>
                    </MainContentElementText>
                </MainContentElement>
            </MainContentContainer>
        </div><div>
                <h4>Testomonial</h4>
                <div className="testimonial-quote group">
                    <img src="https://hogg.utexas.edu/wp-content/uploads/2019/07/mia.png" />
                    <div className="quote-container">
                        <blockquote>
                            <p>This is the best place to shop with your Celo Wallet”</p>
                        </blockquote>
                    </div></div></div></>

    )
}

export default MainContent;