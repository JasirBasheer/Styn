import React, { useState } from 'react';
import { Link } from "react-router-dom";
import {Bag,Equals} from "phosphor-react";
import "./navbar.css"

export const Navbar = () => {
  const [burger_class, setBurgerClass] = useState("burger-bar unclicked")
  const [menu_class, setMenuClass] = useState("menu hidden")
  const [isMenuClicked, setIsMenuClikced] = useState("menu hidden")

  const updateMenu = () =>{
    if(!isMenuClicked){
       setBurgerClass("burger-bar clicked")
       setMenuClass("menu visible")
    }
    else{
      setBurgerClass("burger-bar unclicked")
      setMenuClass("menu hidden")
    }
    setIsMenuClikced(!isMenuClicked)
  }

  return (
    <div>
      <nav className='navbar'>

<div className="handburger-icon">
        <Link  >
            <Equals className='hamburger-menu' size={28} onClick={updateMenu}/>
            </Link>
      <div className="burger-menu" >
        <div className={burger_class} ></div>
        <div className={burger_class} ></div>
        <div className={burger_class} ></div>

      </div>

        </div>
        
          
        <div className="styn-log">
            <Link className='logo' to={"/"} >Styn</Link>
        </div>
        <div className="cart-icon">
        <Link className='cart' to={"/cart"} >
            <Bag size={20}/>
            </Link>
        </div>
        </nav>

        <div className={menu_class}>
        <Link className='logo' to={"/"} >Styn</Link><br />
        <a href="/">Shop</a><br />
        <a href="/cart">Cart</a><br />
       <a href="/">About</a><br />
          

        </div>
      
      
    </div>
  )
}

export default Navbar
