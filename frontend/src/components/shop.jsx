import React from 'react';
import './shop.css';
import {useDispatch } from 'react-redux';
import { useGetAllProductsQuery } from '../features/productsApi';
import { addToCart } from '../features/cartSlice';
// import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


export const Shop = () => {
  const {data,error, isLoading} = useGetAllProductsQuery();
  const dispatch = useDispatch()
  const history = useNavigate()

  const handleAddToCart = (product) =>{
    dispatch(addToCart(product))
    history("/cart");
  };

  return (
    <div className='shop'>
      { isLoading ?( 
      <p>Loading</p>
      ) : error ? (
      <p>An error occured...</p>
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