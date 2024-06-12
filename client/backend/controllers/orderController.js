const OrderModel = require('../models/OrderModel');
const Order = require('../dist/classes/Order.js');

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
  getAllOrders,
  getOrderById,
};