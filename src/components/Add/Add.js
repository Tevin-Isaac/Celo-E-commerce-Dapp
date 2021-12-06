import { useState } from 'react';
import {Button} from '../../Globalstyles';
import './index.css';

import {
    AddContainer,
    AddTitle,
    AddCardContent,
    AddInput,
    AddIcon
} from './Add.styles';

const Add = props => {

    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('')
    const [location, setLocation] = useState('')
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState('')
    


    const submitHandler = (event) => {
        event.preventDefault();
        props.addToProduct(name, image, description, location, category, price);
        setName('');
        setImage('');
        setDescription('');
        setLocation('');
        setCategory('');
        setPrice('');
       
    }

    return (
        <div>
            
            <form onSubmit = {submitHandler}>
                <AddContainer>
                    <AddTitle> Add Product</AddTitle>
                    <AddCardContent>
                        <AddInput placeholder="Name" required 
                        onChange = {(e)=>setName(e.target.value)}/>
                        <AddInput placeholder="Image Url" required
                        onChange = {(e)=>setImage(e.target.value)}/>
                    </AddCardContent>
                    <AddCardContent>
                        <AddInput placeholder="Description" required
                        onChange = {(e)=>setDescription(e.target.value)}/>
                        <AddInput placeholder="Location" required
                        onChange = {(e)=>setLocation(e.target.value)}/>
                    </AddCardContent>
                    <AddCardContent>
                        <AddInput placeholder="Category" required
                        onChange = {(e)=>setCategory(e.target.value)}/>
                        <AddInput placeholder="Price" required type="number"
                        onChange = {(e)=>setPrice(e.target.value)}/>
                    </AddCardContent>
                    <Button type="submit" info><AddIcon/>Add Product</Button>
                </AddContainer>
            </form>
        </div>

    );
}

export default Add;