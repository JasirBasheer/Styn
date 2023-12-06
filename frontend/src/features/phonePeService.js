// phonePeService.js
export const initiatePhonePePayment = async (paymentDetails) => {
    try {
      const response = await fetch('/createPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentDetails),
      });
  
      if (!response.ok) {
        throw new Error('Failed to initiate PhonePe payment');
      }
  
      const paymentResponse = await response.json();
  
      return paymentResponse;
    } catch (error) {
      throw new Error('Error initiating PhonePe payment: ' + error.message);
    }
  };
  