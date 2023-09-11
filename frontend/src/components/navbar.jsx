import React from 'react';
import { Link } from "react-router-dom";
import {ShoppingCart} from "phosphor-react";
import "./navbar.css"

export const Navbar = () => {
  return (
    <div className='navbar'>
        <div className="styn-log">
            <Link  to={"/"} >Styn</Link>
        </div>
           <div className="cart-icon">
        <Link  to={"/cart"} >
            <ShoppingCart size={32}/>
            </Link>
        </div>
      
    </div>
  )
}

export default Navbar
