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
            {/* <span className='bag-quantity'>
              <span>3</span>
              </span>
        */}
        </div>
        </nav>

        <div className={menu_class}>
        <Link className='menu-logo' to={"/"} >Styn</Link><br />
        <Link className='menu-logo1' to={"/"} >Shop</Link><br />
        <Link className='menu-log1o' to={"/cart"} >Cart</Link><br />
        <Link className='menu-1logo' to={"/"} >About</Link><br />
        
          

        </div>
      
      
    </div>
  )
}

export default Navbar
