// DeliveryForm.js
import React, { useState } from "react";
import { useDispatch} from "react-redux";
import { setDeliveryData, submitDeliveryData } from "../features/deliverySlice";
import { useNavigate } from "react-router-dom";
import './Address.css'

export const DeliveryForm = () => {
  const dispatch = useDispatch();
  const history = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setDeliveryData(formData));
    try {
      await dispatch(submitDeliveryData(formData));
      history("/checkout");
    } catch (error) {
      // Handle any submission errors
    }
  };



  return (
    <form className="delivery-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="contactNumber">Contact Number</label>
        <input
          type="text"
          id="contactNumber"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="rzp-button1">Submit</button>
   
    </form>
  );
};
export default DeliveryForm;
