const ToppingModel = require('../models/ToppingModel');
const mongoose = require('mongoose');

class ToppingController {
    getAllTopping = async (req, res) => {
        try {
            const toppings = await ToppingModel.find();
            if (!toppings || toppings.length === 0) {
                res.json({success: false, message: "No Topping Available"});
            }
            res.json(toppings);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching toppings.' });
        }
    };
    
    getToppingById = async (req, res) => {
        try {
            const topping = await ToppingModel.findById(req.params.id);
            if (!topping) {
                res.status(204).json({message: 'Topping not found.' });
            }

            res.status(200).json(topping);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching the topping.' });
        }
    };

    createTopping = async (req, res) => {
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
            res.status(500).json({ error: 'Unable to create product: ' + error.message });
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
                throw new Error("In validate productId");
            }

            // Find and update the product by ID with only the specified fields
            const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });

            if (!updatedProduct) {
                res.status(204).json({ message: 'Product not found' });
            }

            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: 'Unable to update product: ' + error.message });
        }
    };

    // Delete Product
    deleteProduct = async (req, res) => {
        try {
            const { productId } = req.params;

            // Validate productId
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                throw new Error("In validate productId");
            }

            // Delete product
            const deletedProduct = await ProductModel.findByIdAndDelete(productId);

            if (!deletedProduct) {
                res.status(204).json({ message: 'Product not found' });
            }

            res.status(200).json(deletedProduct);
        } catch (error) {
            res.status(500).json({ error: 'Unable to delete product: ' + error.message });
        }
    };
}