const express = require("express");
const mongoose = require("mongoose");
const ErrorHandler = require("./utils/ErrorHandler");

const app = express();

// MongoDB connection URI from .env
const DB_URL = "mongodb+srv://jasirbasheer:styn12345@cluster0.5wmvznz.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB using Mongoose
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Define your routes and middleware here
// Example: app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const errorHandler = new ErrorHandler(err, req, res);
  errorHandler.handle();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Routers //
app.get('/', function(req, res) {
  res.send('Hello Sir');
});

app.get('/singleproducts/:id', function(req, res) {
  res.send('Hello Sir');
});

app.get('/api/products', function(req, res) {
  res.render('Users');
});

app.get('/api', function(req, res) {
  res.send('Users');
});

app.get('/api/products/', function(req, res) {
  res.send('Users');
});
