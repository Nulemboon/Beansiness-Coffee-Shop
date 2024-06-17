const ProductModel = require('../models/ProductModel');
const { isBlock } = require('typescript');
const mongoose = require('mongoose');

class ProductController {
    getAllProducts = async (req, res) => {
        try {
            const products = await ProductModel.find();
            // const productList = products.map(product => new Product(product.id, product.name, product.description, product.price));
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching products.' });
        }
    };
    
    getProductById = async (req, res) => {
        try {
            const product = await ProductModel.findById(req.params.id);
            if (product) {
                // const productObj = new Product(product.id, product.name, product.description, product.price);
                res.json(productObj);
            } else {
                res.status(404).json({ error: 'Product not found.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching the product.' });
        }
    };
    
    getProductByQuery = async (req, res) => {
        try {
            const query = req.params.q;
            const product = await ProductModel.find({
                name: { $regex: '.*' + query + '.*'}
            })
    
            if (product) {
                // const productObj = new Product(product.id, product.name, product.description, product.price);
                res.json(productObj);
            } else {
                res.status(404).json({ error: 'Product not found.' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    };

    createProduct = async (req, res) => {
        try {
            const newData = req.body();
            const newProduct = ProductModel(newData)

            const saveProduct = await newProduct.save();
            res.status(200).json(saveProduct);
        } catch (error) {
            res.status(500).json({ message: 'Unable to create product', error: error.message });
        }
    }

    updateProduct = async (req, res) => {
        try {
            const { productId } = req.params;
            const updateData = req.body;

            // Validate accountId
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ message: 'Invalid product ID' });
            }

            // Find and update the account by ID with only the specified fields
            const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });

            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json(updatedProduct);

        } catch (error) {
            res.status(500).json({ message: 'Unable to update product', error: error.message });
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const { productId } = req.params;

            // Validate voucherId
            if (!mongoose.Types.ObjectId.isValid(voucherId)) {
                return res.status(400).json({ message: 'Invalid voucher ID' });
            }

            // Delete product
            const deletedProduct = await ProductModel.findByIdAndDelete(productId);

            if (!deletedProduct) {
                return res.status(404).json({ message: 'Voucher not found' });
            }

            res.status(200).json({ message: 'Voucher deleted successfully', product: deletedProduct });
        } catch (error) {
            res.status(500).json({ message: 'Unable to update product', error: error.message })
        }
    }
}


module.exports = new ProductController();