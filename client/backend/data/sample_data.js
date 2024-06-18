const mongoose = require('mongoose');
const AccountModel = require('../models/AccountModel');
const ProductModel = require('../models/ProductModel');
const ToppingModel = require('../models/ToppingModel');
const OrderModel = require('../models/OrderModel');
const OrderItemModel = require('../models/OrderItemModel');
const TransactionModel = require('../models/TransactionModel');
const VoucherModel = require('../models/VoucherModel');
const ReviewModel = require('../models/ReviewModel');

const sampleData = require('./sampleData.json');

async function insertSampleData() {
    await mongoose.connect('mongodb://localhost:27017/your_database_name', { useNewUrlParser: true, useUnifiedTopology: true });

    await AccountModel.deleteMany({});
    await ProductModel.deleteMany({});
    await ToppingModel.deleteMany({});
    await OrderModel.deleteMany({});
    await OrderItemModel.deleteMany({});
    await TransactionModel.deleteMany({});
    await VoucherModel.deleteMany({});
    await ReviewModel.deleteMany({});

    await AccountModel.insertMany(sampleData.accounts);
    await ProductModel.insertMany(sampleData.products);
    await ToppingModel.insertMany(sampleData.toppings);
    await OrderModel.insertMany(sampleData.orders);
    await OrderItemModel.insertMany(sampleData.order_items);
    await TransactionModel.insertMany(sampleData.transactions);
    await VoucherModel.insertMany(sampleData.vouchers);
    await ReviewModel.insertMany(sampleData.reviews);

    console.log('Sample data inserted successfully!');
    mongoose.connection.close();
}

insertSampleData().catch(err => console.error(err));
