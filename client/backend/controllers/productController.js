const ProductModel = require('../models/ProductModel');
const { isBlock } = require('typescript');
const mongoose = require('mongoose');

class ProductController {
    getAllProducts = async (req, res) => {
        try {
            const products = await ProductModel.find();
            if (!products || products.length === 0) {
                res.json({success: false, message: "No product Available"});
                return;
            }
            res.json({success: true, data: products});
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
            const image_file = req.file ? req.file.filename : null;

            const { name, description, price, category, toppings } = req.body;
            const newProduct = new ProductModel({
                name,
                description,
                price,
                category,
                imageURL: image_file,
                available_toppings: toppings,
            });

            const saveProduct = await newProduct.save();
            res.status(200).json(saveProduct);
        } catch (error) {
            res.status(500).json({ message: 'Unable to create product', error: error.message });
        }
    };

    // Update Product with Optional Image Upload
    updateProduct = async (req, res) => {
        try {
            const { productId, ...updateData } = req.body;

            // Check if an image is uploaded
            if (req.file) {
                updateData.imageURL = req.file.filename;
            }

            // Validate productId
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ message: 'Invalid product ID' });
            }

            // Find and update the product by ID with only the specified fields
            const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });

            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(500).json({ message: 'Unable to update product', error: error.message });
        }
    };

    // Delete Product
    deleteProduct = async (req, res) => {
        try {
            const { productId } = req.body;

            // Validate productId
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ message: 'Invalid product ID' });
            }

            // Delete product
            const deletedProduct = await ProductModel.findByIdAndDelete(productId);

            if (!deletedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
        } catch (error) {
            res.status(500).json({ message: 'Unable to delete product', error: error.message });
        }
    };
}


module.exports = new ProductController();