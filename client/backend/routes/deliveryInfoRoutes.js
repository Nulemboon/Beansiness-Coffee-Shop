const express = require('express');
const deliveryInfoController = require('../controllers/deliveryInfoController');
const {authenticate, roleMiddleware} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', deliveryInfoController.createDeliveryInfo);

router.delete('/:id', deliveryInfoController.deleteUserDeliveryInfo);

module.exports = router;