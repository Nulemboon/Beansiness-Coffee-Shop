const OrderModel = require('../models/OrderModel');
const Order = require('../classes/Order.js');
const Cart = require('../classes/Cart.js');
const DeliveryInfo = require('../classes/DeliveryInfo.js');


const getCurrentOrders = async (req, res) => {
    try {
        const cartJson = req.cookies.cart;
        const deliveryInfoJson = req.cookies.delivery;

        if (!cartJson || !deliveryInfoJson) {
            // If cart and delivery information are not available ?
        }

        const cartObj = JSON.parse(cartJson);
        const deliveryInfoObj = JSON.parse(deliveryInfoJson);

        // Create Cart and DeliveryInfo Class
        const cartClass = new Cart(cartObj.productList);

        const deliveryInfoClass = new DeliveryInfo(
            deliveryInfoObj.receiverName, deliveryInfoObj.address, 
            deliveryInfoObj.phoneNumber, deliveryInfoObj.instruction
        );

        const orderClass = new Order(cartClass, deliveryInfoClass, 10000, 'not paid');
        // If user sign in -> can save order.
        res.json(orderClass);

    } catch (error) {
        res.status(500).json({ error: error.message});
    }
}


const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find();
        const orderList = orders.map(order => new Order(order.id, order.name, order.description, order.price));
        res.json(orderList);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching orders.' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await OrderModel.findById(req.params.id);
        if (order) {
            const orderObj = new Order(order.id, order.name, order.description, order.price);
            res.json(orderObj);
        } else {
            res.status(404).json({ error: 'Order not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the order.' });
    }
};

module.exports = {
    getCurrentOrders,
    getAllOrders,
    getOrderById,
};