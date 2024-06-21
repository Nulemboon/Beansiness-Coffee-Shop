const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const ReviewSchema = new Schema({
    review: { type: String, required: true },
    rating: { type: Number, required: true },
    account_id: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    created_at: { type: Date, default: Date.now }
});

const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: {type: String, required: true},
    price: {type: Number, required: true },
    category: {type: String, required: true},
    imageURL: {type: String},

    available_toppings: [{
        type: Schema.ObjectId,
        ref: "Topping"
    }],

    reviews: [ReviewSchema]
})

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;