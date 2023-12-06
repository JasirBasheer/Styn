const { newPayment, checkStatus } = require('../PhonePe/paymentController');
const express = require('express');
const router = express.Router();

router.post('/payment', newPayment);
router.post('/status/:txnId', checkStatus);

module.exports = router;
