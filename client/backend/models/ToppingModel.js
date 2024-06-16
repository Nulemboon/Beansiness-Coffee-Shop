const mongoose = require('mongoose');

const ToppingSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    price: {type: Number, required: true, unique: false}
})

const ToppingModel = mongoose.model('Topping', ToppingSchema);

module.exports = ToppingModel;