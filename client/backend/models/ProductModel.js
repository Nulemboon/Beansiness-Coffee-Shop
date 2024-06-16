const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: {type: String, required: true, unique: true },
    price: {type: Number, required: true, unique: false}
})

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;