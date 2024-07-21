const ProductModel = require('../models/ProductModel');
const mongoose = require('mongoose');

class ProductController {
    getAllProducts = async (req, res) => {
        try {
            const products = await ProductModel.find().populate('available_toppings');
            if (!products || products.length === 0) {
                res.status(404).json({message: "No product Available"});
                return;
            }
            
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({error: 'An error occurred while fetching products:' + error.message});
        }
    };
    
    getProductById = async (req, res) => {
        try {
            const product = await ProductModel.findById(req.params.id).populate('available_toppings');
            if (!product) {
                res.status(404).json({message: `Product not found` });
                return;
            }

            res.status(200).json(product);

        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching the product: ' + error.message });
        }
    };
    
    getProductByQuery = async (req, res) => {
        try {
            const query = req.params.q;
            const products = await ProductModel.find({
                name: { $regex: '.*' + query + '.*'}
            });
    
            if (!products) {
                res.status(404).json({ error: `Product not found` });
                return;
            }

            res.status(200).json(products);

        } catch (error) {
            res.status(500).json({ error: "An error occurred while fetching the product: " + error.message});
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
            res.status(200).json({ message: 'Product has been created.'});
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
                res.status(404).json({ message: 'Product not found' });
                return;
            }

            // Find and update the product by ID with only the specified fields
            const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });

            if (!updatedProduct) {
                res.status(404).json({ message: 'Product not found' });
                return;
            }

            res.status(200).json({ message: `Product has been updated: ${productId}`});
        } catch (error) {
            res.status(500).json({ error: 'Unable to update product: ' + error.message });
        }
    };

    // Delete Product
    deleteProduct = async (req, res) => {
        try {
            const productId = req.params.id;

            // Validate productId
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                res.status(404).json({ message: 'Product not found' });
                return;
            }

            //Unlink image
            const product = await ProductModel.findById(productId);
            // fs.unlink(`uploads/${product.imageURL}`, () => { })

            // Delete product
            const deletedProduct = await ProductModel.findByIdAndDelete(productId);

            if (!deletedProduct) {
                res.status(404).json({ message: `Product not found: ${productId}` });
                return;
            }

            res.status(200).json({ message: `Product has been deleted: ${productId}`});
        } catch (error) {
            res.status(500).json({ error: 'Unable to delete product: ' + error.message });
        }
    };

    addReview = async (req, res) => {
        try {
            const productId = req.params.id;
            const accountId = req.user.id;
            const { review, rating } = req.body;
    
            // Find the product by ID
            const product = await ProductModel.findById(productId);
    
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            // Create a new review
            const newReview = {
                review: review,
                rating: rating,
                account_id: accountId,
                created_at: new Date()
            };
    
            // Add the review to the product's reviews array
            product.reviews.push(newReview);
    
            // Save the updated product
            const updatedProduct = await product.save();
    
            res.status(200).json({message: 'Review has been added.'});
        } catch (error) {
            res.status(500).json({ error: 'Unable to add review' + error.message });
        }
    };

    removeReview = async (req, res) => {
        try {
            const { productId, reviewId } = req.body;
    
            // Find the product by ID
            const product = await ProductModel.findById(productId);
    
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            // Find the index of the review to be removed
            const reviewIndex = product.reviews.findIndex(review => review._id.toString() === reviewId);
    
            if (reviewIndex === -1) {
                return res.status(404).json({ message: 'Review not found' });
            }
    
            // Remove the review from the reviews array
            product.reviews.splice(reviewIndex, 1);
    
            // Save the updated product
            const updatedProduct = await product.save();
    
            res.status(200).json({message: 'Review has been removed.'});
        } catch (error) {
            res.status(500).json({ error: 'Unable to remove review' + error.message });
        }
    };
}


module.exports = new ProductController();