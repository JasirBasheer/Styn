import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSingleProductQuery } from "../features/productsApi";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";
import "./SingleProduct.css";

const SingleProduct = () => {
  const { productId } = useParams();
  const { data, error, isLoading } = useGetSingleProductQuery(productId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(""); // State for selected size

  const handleAddToCart = (product) => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    // Add the selected size to the product object
    const productWithSize = { ...product, size: selectedSize };

    dispatch(addToCart(productWithSize));
    navigate("/cart");
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="single-product-container">
      <div className="product-details">
        <img className="product-image" src={data.image} alt={data.name} />
        <div className="image-gallery">
          {data.images && data.images.map((image, index) => (
            <img className="thumbnail-image" key={index} src={image} alt={`Product ${index + 1}`} />
          ))}
        </div>
        <div className="product-info">
          <h1 className="product-title">
            {data.name} {selectedSize && `(${selectedSize})`}
          </h1>
          <p className="product-price">₹{data.price}</p>
          <h1>select your size</h1>
          {data.sizes && (
            <select
              value={selectedSize}
              onChange={(e) => handleSizeSelect(e.target.value)}
              className="size-select"
            >
              <option value="">Select Size</option>
              {data.sizes.map((size, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))}
            </select>
          )}
          <button
            className="add-to-cart-button"
            onClick={() => handleAddToCart(data)}
          >
            Add to Cart
          </button>
        </div>
      </div>
      <div className="product-description">
        <h2 className="description-heading">Product Description</h2>
        <p className="description-text">{data.description}</p>
      </div>
    </div>
  );
};

export default SingleProduct;
