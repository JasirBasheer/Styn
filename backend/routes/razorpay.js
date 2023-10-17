var instance = new Razorpay({ key_id: 'YOUR_KEY_ID', key_secret: 'YOUR_SECRET' })

instance.paymentLink.create({
  upi_link: true,
  amount: 500,
  currency: "INR",
  accept_partial: false,
  first_min_partial_amount: 100,
  description: "For XYZ purpose",
  customer: {
    name: "Gaurav Kumar",
    email: "gaurav.kumar@example.com",
    contact: "+919000090000"
  },
  notify: {
    sms: true,
    email: true
  },
  reminder_enable: true,
  notes: {
    policy_name: "Jeevan Bima"
  }
})