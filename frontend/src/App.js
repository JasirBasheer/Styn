import React from 'react'
import "./App.css"
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Navbar } from "./components/navbar.jsx";
import { Shop } from "./components/shop";
import { Cart } from "./components/cart";
import { Footer } from "./components/footer.jsx";
import { SingleProduct } from "./components/singleproducts.jsx";
import { ErrorPage } from './components/error';
import { Admin } from './admin/pages/dasbord/shop.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




 
function App() {
  return (
    <div className='App'>

<Router>
  <ToastContainer/>
  <Navbar />
  <Routes>
    <Route path='/' element={<Shop/>} />
    <Route path='/cart'element={<Cart/>} />
    <Route path='/singleproduct/:id'element={< SingleProduct />} />
    <Route path='*' element={< ErrorPage />} />
    <Route path='/stynadmin' element={<Shop/>} />
    <Route path='/admin' element={<Admin/>} />

  </Routes>
  <Footer/>
</Router>



    </div>
  )
}

export default App
