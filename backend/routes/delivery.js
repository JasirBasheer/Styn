// deliveryRoutes.js
const express = require("express");
const router = express.Router();
const Delivery = require("../models/Delivery"); // Import your Delivery model

router.post("/", async (req, res) => {
  try {
    const deliveryData = req.body;
    const newDelivery = new Delivery(deliveryData);
    await newDelivery.save();
    res.json({ message: "Delivery data saved successfully" });
  } catch (error) {
    console.error("Error saving delivery data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
