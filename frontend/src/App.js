import React from 'react'
import "./App.css"
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Navbar } from "./components/navbar.jsx";
import { Shop } from "./components/shop";
import { Cart } from "./components/cart";
import { Footer } from "./components/footer.jsx";
import SingleProduct from "./components/singleproducts.jsx"; 
import { ErrorPage } from './components/error';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import  { DeliveryForm }  from './components/Address.jsx'
import Payment from './components/payment.jsx';





 
function App() {
  return (
    <div className='App'>

<Router>
  <ToastContainer/>
  <Navbar />
  <Routes>
    <Route path='/' element={<Shop/>} />
    <Route path='/cart'element={<Cart/>} />
    <Route path='/register' element={<Register />} />
    <Route path='/login' element={<Login />} />
    <Route path='/products/:productId'element={< SingleProduct />} />
    <Route path='*' element={< ErrorPage />} />
    <Route path='/address' element={<DeliveryForm/>} />
    <Route path='/checkout' element={<Payment/>} />

  </Routes>
  <Footer/>
</Router>



    </div>
  )
}

export default App
