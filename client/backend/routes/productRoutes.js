const express = require('express');
const { getAllProducts, getProductById } = require('../controllers/productController');

function routes(app) {
    app.get('/home', getAllProducts);
    app.get('/product', getAllProducts);
    app.get('/product/:id', getProductById);
    app.get('/product/:q', getProductByQuery);
}

module.exports = {
    routes
};