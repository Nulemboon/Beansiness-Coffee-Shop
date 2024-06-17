const OrderModel = require('../models/OrderModel.js');
const Order = require('../classes/Order.js');
const CartController = require('./cartController.js');


class OrderController {
    getAllOrders = async (req, res) => {
        try {
            const orders = await OrderModel.find();
            const orderList = orders.map(order => new Order(order.id, order.name, order.description, order.price));
            res.json(orderList);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching orders.' });
        }
    };
    
    getOrderById = async (req, res) => {
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

    placeOrder = async (req, res) => {
        try {
            const cart = await CartController.getCartFromCookies;
            
            for (cartItem in cart) {
                
            }
            
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching the order.' });
        }
    };



}


module.exports = new OrderController();