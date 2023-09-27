import React from 'react'
import { Link } from "react-router-dom";

export const ErrorPage = () => {
  return (
    <div className='not-found'>
      <h2>404</h2>
      <p>Page not found</p>
      <Link  className='redirect-to-shop' to={"/"}>Go to shop</Link>
    </div>
  )
}

export default ErrorPage
