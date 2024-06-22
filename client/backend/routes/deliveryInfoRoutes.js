const express = require('express');
const deliveryInfoController = require('../controllers/deliveryInfoController');

const router = express.Router();

router.post('/', deliveryInfoController.createDeliveryInfo);

router.delete('/:id', deliveryInfoController.deleteDeliveryInfo);

module.exports = router;