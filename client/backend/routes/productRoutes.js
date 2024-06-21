const productController = require('../controllers/productController');

const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`);
    }
})

const upload = multer({ storage: storage})

router.get('/:id', productController.getProductById);

router.get('/:q', productController.getProductByQuery);

router.get('/', productController.getAllProducts);

router.post('/add-review/:id', productController.addReview);

router.post('/', upload.single('image'), productController.createProduct);

router.put('/', upload.single('image'), productController.updateProduct);

router.delete('/delete-review/:id', productController.removeReview);

router.delete('/:id', productController.deleteProduct);

// router.get('/', productController.getAllProducts);

module.exports = router;