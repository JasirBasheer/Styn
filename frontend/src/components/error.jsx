import React from 'react'
import { Link } from "react-router-dom";
import "./error.css"

export const ErrorPage = () => {
  return (
    <div className='not-found'>
      <h2>404</h2>
      <p>Page not found</p>
      <div className="continue-shopping">
      <Link  className='redirect-to-shop' to={"/"}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
</svg> 
        <span > Go back to shop </span></Link>
        </div>
    </div>
  )
}

export default ErrorPage
