const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const products = require("./products");
const delivery = require("./routes/delivery");
const phonepeRoute = require("./routes/Phonepee");
const bodyParser = require('body-parser');
const router = express.Router(); 


const app = express();

require("dotenv").config();

router.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/delivery", delivery);
app.use("/api", phonepeRoute);

app.get("/", (req, res) => {
    res.send("Welcome to our styn API...");
});

app.get("/products", (req, res) => {
    res.send(products);
});

// Endpoint to fetch a single product by productId
app.get('/products/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  const product = products.find((p) => p.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// PhonePe API credentials
const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';
const phonePeApiBaseUrl = 'https://sandboxapi.phonepe.com';

// Payment initiation route
app.post('/api/initiate-payment', async (req, res) => {
  try {
    // Extract payment initiation parameters from the request body
    const { amount, orderId, redirectUrl, /* other parameters */ } = req.body;

    // Make an API request to initiate payment with PhonePe
    const response = await axios.post(
      `${phonePeApiBaseUrl}/v3/payment/initiate`,
      {
        amount,
        orderId,
        redirectUrl,
        // Add other payment initiation parameters here
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





const port = process.env.PORT || 8000;
const uri = process.env.DB_URI;

app.listen(port, () => console.log(`Server running on port ${port}`));

mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Database Connected successfully"))
    .catch((err) => console.log("Database Connection failed", err.message));
