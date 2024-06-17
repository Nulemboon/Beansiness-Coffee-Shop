const productController = require('../controllers/productController');

const express = require('express');
const router = express.Router();

router.get('/:id', productController.getProductById);

router.get('/:q', productController.getProductByQuery);

router.get('/', productController.getAllProducts);
// router.get('/', productController.getAllProducts);



module.exports = router;