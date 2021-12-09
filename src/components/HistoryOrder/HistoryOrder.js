import {
    HistoryOrderContainer,
    HistoryOrderTitle,
} from './HistoryOrder.styles';
const HistoryOrder = props => {

    return (
        <div>
            <HistoryOrderContainer>
                <HistoryOrderTitle> History Order</HistoryOrderTitle>
                <table>
                    <thead>
                        <tr>
                            <td>Index</td>
                            <td>Name</td>
                            <td>Price</td>
                            <td>Total sold</td>
                        </tr>
                    </thead>
                    <tbody>
                        {props.products.map(products =>
                            <tr>
                                <td>{products.index}</td>
                                <td>{products.name}</td>
                                <td>$ {products.price/ 1000000000000000000}</td>
                                <td>{products.sold}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </HistoryOrderContainer>
        </div>

    );
}

export default HistoryOrder;