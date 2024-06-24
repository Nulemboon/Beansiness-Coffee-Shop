const express = require('express');
const toppingController = require('../controllers/toppingController');

const router = express.Router();

router.get('/', toppingController.getAllTopping);

router.post('/', toppingController.createTopping);

router.delete('/:id', toppingController.deleteTopping);

module.exports = router;