import axios from 'axios';




const initialState = {
    loading: false,
    paymentData: null,
    error: null,
  };
  
  const paymentReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'INITIATE_PAYMENT_SUCCESS':
        return {
          ...state,
          loading: false,
          paymentData: action.payload,
          error: null,
        };
      case 'INITIATE_PAYMENT_FAILURE':
        return {
          ...state,
          loading: false,
          paymentData: null,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default paymentReducer;
  

  // client/src/actions/paymentActions.js


export const initiatePayment = () => async (dispatch) => {
  try {
    // Make an API request to your server to initiate payment
    const response = await axios.post('/api/payment/initiate-payment', {
      // Provide payment initiation parameters
      // ...
    });

    // Dispatch a Redux action to update the payment state
    dispatch({ type: 'INITIATE_PAYMENT_SUCCESS', payload: response.data });
  } catch (error) {
    console.error('Error initiating payment:', error);
    dispatch({ type: 'INITIATE_PAYMENT_FAILURE', payload: error.message });
  }
};
