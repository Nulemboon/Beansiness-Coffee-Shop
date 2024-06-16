const ProductModel = require('../models/ProductModel');
const Product = require('../classes/Product.js');

const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find();
        const productList = products.map(product => new Product(product.id, product.name, product.description, product.price));
        res.json(productList);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching products.' });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (product) {
            const productObj = new Product(product.id, product.name, product.description, product.price);
            res.json(productObj);
        } else {
            res.status(404).json({ error: 'Product not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the product.' });
    }
};

const getProductByQuery = async (req, res) => {
    try {
        const query = req.params.q;
        const product = await ProductModel.find({
            name: { $regex: '.*' + query + '.*'}
        })

        if (product) {
            const productObj = new Product(product.id, product.name, product.description, product.price);
            res.json(productObj);
        } else {
            res.status(404).json({ error: 'Product not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    getProductByQuery
};