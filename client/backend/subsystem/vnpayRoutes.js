const express = require('express');
const vnpayController = require('./vnpayController');

const router = express.Router();
router.post('/create_payment_url', vnpayController.createUrlPayment);
router.get('/order/vnpay_return', vnpayController.getResponse);

module.exports = router;