const reportController = require('../controllers/reportController');
const {authenticate, roleMiddleware} = require('../middleware/authMiddleware');

const express = require('express');
const router = express.Router();

router.get('/product-sold', authenticate, roleMiddleware(['Admin']), reportController.getRevenuePerProduct);
router.get('/revenue', authenticate, roleMiddleware(['Admin']), reportController.getDailyRevenue);
router.get('/sales', authenticate, roleMiddleware(['Admin']), reportController.getSalesPerDay);


module.exports = router;