const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    order_id: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
    },
    toppings: [{
        type: Schema.Types.ObjectId,
        ref: 'Topping'
    }]
});

const OrderItem = mongoose.model('OrderItem', OrderItemSchema);

module.exports = OrderItem;