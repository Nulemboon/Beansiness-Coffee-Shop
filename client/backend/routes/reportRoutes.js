const reportController = require('../controllers/reportController');

const express = require('express');
const router = express.Router();

router.get('/product-sold', reportController.getRevenuePerProduct);
router.get('/revenue', reportController.getDailyRevenue);
router.get('/sales', reportController.getSalesPerDay);


module.exports = router;