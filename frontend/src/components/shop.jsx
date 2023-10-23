import React from 'react';
import './shop.css';
import {useDispatch, useSelector } from 'react-redux';
import { useGetAllProductsQuery } from '../features/productsApi';
import { Link } from 'react-router-dom';
import { BarLoader} from 'react-spinners'



export const Shop = () => {

  const {data,error, isLoading} = useGetAllProductsQuery();
  const dispatch = useDispatch()

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
        <p>Refresh the page or please come back later :)</p>  
        </div>
    
      ) :(
         <>
         
         <div className='shopTitle'>
        <h1>Shop</h1>
        </div> 
     <div className="products">
     {/* <SingleProduct productId={productId} /> */}
          {data?.map(product => <div key={product.id} className='product'>
            <Link className='linkk' to={`/products/${product.id}`}>
             <img src={product.image} alt={product.name}/>
            <div className="description">
             <p>{product.name}</p>
              <p className='price'>₹{product.price}</p>
             
            </div>
            </Link>
            
          </div>)}
         </div>
         </>
         )}


     
   
    </div>
  )
}



export default Shop;