import {OutlineButton, Button} from '../../Globalstyles';
import {
    OrderContainer,
    OrderWrapper,
    OrderContentContainer,
    OrderTabContainer,
    OrderBtn,
    OrderCardWrapper,
    OrderCardSection,
    OrderCardDescription,
    OrderCard,
    OrderCardContent,
    OrderCardHeading,
    OrderCardDetails,
    OrderCardItems,
    OrderCardTitle,
    OrderCardItem,
    OrderCardIcon,
    OrderCardText,
    Img,
    OrderCardBuy,
    OrderBuyIcon

} from './Orders.styles';
const Orders = props => {
    return (
        <div>
            <OrderWrapper>
                <OrderContainer>
                    <OrderContentContainer>
                        <OrderTabContainer>
                            <OrderBtn to='/'>
                                <OutlineButton big bigFont bigRadius>Sweater</OutlineButton>
                            </OrderBtn>
                            <OrderBtn to='/'>
                                <OutlineButton big bigFont bigRadius>Plain Shirts</OutlineButton>  
                            </OrderBtn>
                            <OrderBtn to='/'>
                                <OutlineButton big bigFont bigRadius>Designer Shirts</OutlineButton>
                            </OrderBtn>
                            <OrderBtn to='/'>
                                <OutlineButton big bigFont bigRadius>Shoes</OutlineButton>  
                            </OrderBtn>
                            <OrderBtn to='/'>
                                <OutlineButton big bigFont bigRadius>Bags</OutlineButton>  
                            </OrderBtn>
                        </OrderTabContainer>
                        <OrderCardWrapper>
                        <OrderCardSection>
                            {props.products.map(product =>
                                <OrderCard key={product.index}>
                                <Img src={product.image}/>
                                <OrderCardContent>
                                    <OrderCardHeading>
                                        {product.name}
                                    </OrderCardHeading>
                                    <OrderCardDescription>
                                        {product.description}
                                    </OrderCardDescription>
                                    <OrderCardDetails>
                                    <OrderCardItems>
                                            <OrderCardTitle>Pending</OrderCardTitle>
                                            <OrderCardItem>
                                                <OrderCardIcon/>
                                                <OrderCardText>{product.pending}</OrderCardText>
                                            </OrderCardItem>
                                        </OrderCardItems>
                                        <OrderCardItems>
                                            <OrderCardTitle>Category</OrderCardTitle>
                                            <OrderCardItem>
                                                <OrderCardText>{product.category}</OrderCardText>
                                            </OrderCardItem>
                                        </OrderCardItems>
                                        <OrderCardItems>
                                            <OrderCardTitle>Location</OrderCardTitle>
                                            <OrderCardItem>
                                                <OrderCardText>{product.location}</OrderCardText>
                                            </OrderCardItem>
                                        </OrderCardItems>
                                    </OrderCardDetails>
                                    <OrderCardDetails>
                                        <OrderCardItems>
                                            <OrderCardTitle>Price</OrderCardTitle>
                                            <OrderCardItem>
                                                <OrderCardText>$ {product.price/ 1000000000000000000}</OrderCardText>
                                            </OrderCardItem>
                                        </OrderCardItems>
                                        <OrderCardItems>
                                            <OrderCardTitle>Sold</OrderCardTitle>
                                            <OrderCardItem>
                                                <OrderCardText>{product.sold}</OrderCardText>
                                            </OrderCardItem>
                                        </OrderCardItems>
                                    </OrderCardDetails>
                                    <OrderCardDetails>
                                        <OrderCardBuy>
                                            <Button onClick={()=>props.orderProduct(product.price / 1000000000000000000, product.index)} info>
                                                <OrderBuyIcon/>Order
                                            </Button>
                                        </OrderCardBuy>
                                    </OrderCardDetails>
                                </OrderCardContent>
                            </OrderCard>
                            )}
                            </OrderCardSection>
                        </OrderCardWrapper>
                    </OrderContentContainer>
                </OrderContainer>
            </OrderWrapper>
            
        </div>
    );
}

export default Orders;
