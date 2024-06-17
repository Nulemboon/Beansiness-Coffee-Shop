const ProductModel = require('../models/ProductModel');
const Product = require('../classes/Product.js');

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
    }
}


module.exports = new ProductController();