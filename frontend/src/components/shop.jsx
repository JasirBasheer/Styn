import React from 'react';
import './shop.css';
import {useDispatch, useSelector } from 'react-redux';
import { useGetAllProductsQuery } from '../features/productsApi';
import { addToCart } from '../features/cartSlice';
// import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { BarLoader} from 'react-spinners'


export const Shop = () => {
  const {items: products, status } =useSelector((state) => state.products);

  const {data,error, isLoading} = useGetAllProductsQuery();
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleAddToCart = (product) =>{
    dispatch(addToCart(product))
    navigate("/cart");
  };

  return (
    <div className='shop'>
      { isLoading ?( 
        <div className="loding">
        <BarLoader color="#111615" />
        </div>
              ) : error ? (
                <div className="lodingg">
        <p>Something went wrong with the server...</p> 
         <br />
        <p>Please come back later :)</p>  
        </div>
    
      ) :(
         <>
         
         <div className='shopTitle'>
        <h1>Shop</h1>
        </div> 
     <div className="products">
          {data?.map(product => <div key={product.id} className='product'>
            {/* <Link to={'/cart'}> */}
             <img src={product.image} alt={product.name}/>
            <div className="description">
             <p>{product.name}</p>
              <p className='price'>₹{product.price}</p>
             
            </div>
            {/* </Link> */}
            <button className='addToCartBttn' onClick={() => handleAddToCart(product)}>Add to cart</button>
          </div>)}
         </div>
         </>
         )}


     
   
    </div>
  )
}



export default Shop;