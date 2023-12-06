// PaymentButton.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const PaymentButton = () => {
  // const dispatch = useDispatch();
  // const paymentState = useSelector((state) => state.payment);
  const [loading2, setLoading2] =useState(false);

  // Ensure paymentState is defined and has the expected structure
  // const { loading = false, paymentData = null, error = null } = paymentState || {};
const data ={
  name: 'jasir',
  amount: 1,
  number:'fjasdk',
  MUID: "MUID" + Date.now(),
  transactionId: 'T' + Date.now()

}



  const handlePayment = async (e) => {
   e.preventDefault();
   setLoading2(true);
   axios.post('http://localhost:5000/api/payment', {...data}).then(res =>{
    setTimeout(() => {
      setLoading2(false);
    }, 1500);
   })
   .catch(error => {
    setLoading2(false)
    console.error(error);
   });



  };

  return (
    <div>
      <button onClick={handlePayment}>
        {loading2 ? 'Initiating Payment...' : 'Initiate Payment'}
      </button>
      {/* {paymentData && <p>Payment Initiated: {paymentData.transactionId}</p>} */}
      {/* {error && <p>Error: {error}</p>} */}
    </div>
  ); 
};

export default PaymentButton;
