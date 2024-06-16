const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const AccountModel = mongoose.model('Account', AccountSchema);

module.exports = AccountModel;