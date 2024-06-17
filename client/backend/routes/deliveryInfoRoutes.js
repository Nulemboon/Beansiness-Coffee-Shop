const express = require('express');
const deliveryInfoController = require('../controllers/deliveryInfoController');

const router = express.Router();

router.get('/', async (req, res) => {
    const deliveryInfo = await deliveryInfoController.getDeliveryInfo(req, res);
    res.json(deliveryInfo);
})

router.post('/', deliveryInfoController.submitDeliveryInfo);

module.exports = router;