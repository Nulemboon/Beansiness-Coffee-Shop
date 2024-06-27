const express = require('express');
const toppingController = require('../controllers/toppingController');

const router = express.Router();

router.get('/:id', toppingController.getToppingById);

router.get('/', toppingController.getAllTopping);

router.post('/', toppingController.createTopping);

router.put('/:id', toppingController.updateTopping);

router.delete('/:id', toppingController.deleteTopping);

module.exports = router;