const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
// Import your models
const AccountModel = require('../models/AccountModel');
const VoucherModel = require('../models/VoucherModel');
const OrderModel = require('../models/OrderModel');
const TransactionModel = require('../models/TransactionModel');
const ReviewModel = require('../models/ReviewModel');
const ProductModel = require('../models/ProductModel');
const StaffModel = require('../models/StaffModel');
const ToppingModel = require('../models/ToppingModel');
const OrderItemModel = require('../models/OrderItemModel');

// Connect to the database
mongoose.connect('mongodb+srv://tri2003714:8825529tT@cluster0.tq9x0ib.mongodb.net/').then(()=>console.log("DB Connected"))

const generateData = async () => {
  try {
    // Clear existing data
    await AccountModel.deleteMany({});
    await VoucherModel.deleteMany({});
    await OrderModel.deleteMany({});
    await TransactionModel.deleteMany({});
    await ReviewModel.deleteMany({});
    await ProductModel.deleteMany({});
    await StaffModel.deleteMany({});
    await ToppingModel.deleteMany({});
    await OrderItemModel.deleteMany({});

    // Generate Vouchers
    const vouchers = [];
    for (let i = 0; i < 10; i++) {
      const voucher = new VoucherModel({
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        required_points: faker.number.int({ min: 50, max: 100 }),
        discount: faker.number.int({ min: 10000, max: 50000 }),
      });
      vouchers.push(voucher);
    }
    await VoucherModel.insertMany(vouchers);

    // Generate Toppings
    const toppings = [];
    for (let i = 0; i < 10; i++) {
      const topping = new ToppingModel({
        name: faker.commerce.productName(),
        price: faker.number.int({ min: 5000, max: 10000 }),
      });
      toppings.push(topping);
    }
    await ToppingModel.insertMany(toppings);

    // Generate Products
    const products = [];
    for (let i = 0; i < 10; i++) {
      const product = new ProductModel({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.number.int({ min: 25000, max: 100000}),
        category: faker.commerce.department(),
        imageURL: faker.image.url(),
        availale_toppings: toppings.slice(0, faker.number.int({ min: 1, max: toppings.length })).map(topping => topping._id),
      });
      products.push(product);
    }
    await ProductModel.insertMany(products);

    // Generate Accounts
    const accounts = [];
    for (let i = 0; i < 10; i++) {
      const account = new AccountModel({
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        point: faker.number.int({ min: 0, max: 1000 }),
        order_id: [],
        isBlock: faker.datatype.boolean(),
        vouchers: vouchers.slice(0, faker.number.int({ min: 1, max: vouchers.length })).map(voucher => ({
          voucher_id: voucher._id,
          quantity: faker.number.int({ min: 1, max: 5 })
        })),
      });
      accounts.push(account);
    }
    await AccountModel.insertMany(accounts);
    // Generate Transactions
    const transactions = [];
    for (let i = 0; i < 10; i++) {
      const transaction = new TransactionModel({
        amount: faker.number.int({ min: 100000, max: 500000 }),
        created_at: faker.date.past(),
        message: faker.lorem.sentence(),
        transaction_content: faker.lorem.paragraph(),
        transaction_id: faker.string.uuid(),
        transaction_num: faker.number.int({ min: 1, max: 1000 }),
      });
      transactions.push(transaction);
    }
    await TransactionModel.insertMany(transactions);

    // Generate Orders
    const orders = [];
    for (let i = 0; i < 10; i++) {
      const order = new OrderModel({
        account_id: accounts[faker.number.int({ min: 0, max: accounts.length - 1 })]._id,
        order_items: [],
        shipping_fee: faker.number.int({ min: 5000, max: 20000 }),
        status: faker.helpers.arrayElement(['Pending', 'Shipped', 'Delivered']),
        transaction_id: transactions[faker.number.int({ min:0, max:transactions.length - 1})]._id,
      });
      orders.push(order);
    }
    await OrderModel.insertMany(orders);

    // Generate Order Items
    const orderItems = [];
    for (let i = 0; i < 10; i++) {
      const orderItem = new OrderItemModel({
        product_id: products[faker.number.int({ min: 0, max: products.length - 1 })]._id,
        quantity: faker.number.int({ min: 1, max: 5 }),
        order_id: orders[faker.number.int({ min: 0, max: orders.length - 1 })]._id,
        toppings: toppings.slice(0, faker.number.int({ min: 0, max: toppings.length })).map(topping => topping._id),
      });
      orderItems.push(orderItem);
    }
    await OrderItemModel.insertMany(orderItems);

    // Update Orders with Order Items
    for (let orderItem of orderItems) {
      await OrderModel.updateOne(
        { _id: orderItem.order_id },
        { $push: { order_items: orderItem._id } }
      );
    }


    // Generate Reviews
    const reviews = [];
    for (let i = 0; i < 10; i++) {
      const review = new ReviewModel({
        review: faker.lorem.paragraph(),
        rating: faker.number.int({ min: 1, max: 5 }),
        account_id: accounts[faker.number.int({ min: 0, max: accounts.length - 1 })]._id,
      });
      reviews.push(review);
    }
    await ReviewModel.insertMany(reviews);

    // Generate Staff
    const staff = [];
    for (let i = 0; i < 10; i++) {
      const staffMember = new StaffModel({
        account_id: accounts[faker.number.int({ min: 0, max: accounts.length - 1 })]._id,
        role: faker.helpers.arrayElement(['Manager', 'Onsite', 'Shipper']),
      });
      staff.push(staffMember);
    }
    await StaffModel.insertMany(staff);

    console.log('Example data inserted successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting example data:', error);
    mongoose.connection.close();
  }
};

generateData();
