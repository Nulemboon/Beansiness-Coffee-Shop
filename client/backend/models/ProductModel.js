const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: {type: String, required: true},
    price: {type: Number, required: true },
    category: {type: String, required: true},
    imageURL: {type: String},

    availale_toppings: [{
        type: mongoose.Schema.ObjectId,
        ref: "Topping"
    }]
})

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;