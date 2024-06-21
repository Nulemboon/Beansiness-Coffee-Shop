const OrderModel = require('../models/OrderModel.js');
const DeliveryInfoModel = require('../models/DeliveryInfoModel');
const AccountModel = require('../models/accountModel.js');
const OrderItemModel = require('../models/OrderItemModel.js');


class OrderController {
    getAllOrders = async (req, res) => {
        try {
            const orders = await OrderModel.find();
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching orders: ' + error.message});
        }
    };

    getOrderById = async (req, res) => {
        try {
            const order = await OrderModel.findById(req.params.id);
            if (!order) {
                res.status(204).json({ message: 'Order not found.' });
                return;
            }

            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching the order: ' + error.message});
        }
    };

    async placeOrder(req, res) {
        try {
            const { delivery_info, shipping_fee, transaction_id } = req.body;
            const cart = req.cookies.cart;

            if (!cart || cart.length === 0) {
                res.status(204).json({ message: 'Cart is empty' });
                return;
            }

            const accountId = req.user.id; // Assuming you have user authentication middleware

            const orderItems = [];
            let totalAmount = 0;

            for (const item of cart) {
                const product = await ProductModel.findById(item.product_id);

                if (!product) {
                    return res.status(400).json({ message: `Product not found: ${item.product_id}` });
                }

                const orderItem = new OrderItemModel({
                    product_id: product._id,
                    quantity: item.quantity,
                    order_id: null, // We'll set this after creating the order
                    toppings: item.toppings
                });

                await orderItem.save();
                orderItems.push(orderItem._id);

                totalAmount += product.price * item.quantity;
            }

            const delivery = new DeliveryInfoModel({
                receiver_name: delivery_info.receiver_name,
                address: delivery_info.address,
                phone_number: delivery_info.phone_number,
                instruction: delivery_info.instruction
            });
            await delivery.save();

            const order = new OrderModel({
                account_id: accountId,
                delivery_info: delivery._id,
                order_items: orderItems,
                shipping_fee,
                status: 'Pending', // Initial order status
                transaction_id,
            });

            await order.save();

            // Link order items to the order
            await OrderItemModel.updateMany({ _id: { $in: orderItems } }, { order_id: order._id });

            // Update user's order list
            await AccountModel.updateOne(
                { _id: accountId },
                { $push: { order_id: order._id } }
            );

            
            res.clearCookie('cart');

            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while placing the order: ' + error.message});
        }
    }

    async offlineOrder(req, res) {
        try {
            // const { delivery_info, shipping_fee, transaction_id, payment_method } = req.body;
            const cart = req.cookies.cart;

            if (!cart || cart.length === 0) {
                res.status(204).json({ message: 'Cart is empty' });
                return;
            }

            const accountId = req.user.id; // Assuming you have user authentication middleware

            const orderItems = [];
            let totalAmount = 0;

            for (const item of cart) {
                const product = await ProductModel.findById(item.product_id);

                if (!product) {
                    res.status(204).json({ message: `Product not found: ${item.product_id}` });
                    return;
                }

                const orderItem = new OrderItemModel({
                    product_id: product._id,
                    quantity: item.quantity,
                    order_id: null, // We'll set this after creating the order
                    toppings: item.toppings
                });

                await orderItem.save();
                orderItems.push(orderItem._id);

                totalAmount += product.price * item.quantity;
            }

            const delivery = new DeliveryInfoModel({
                receiver_name: delivery_info.receiver_name,
                address: delivery_info.address,
                phone_number: delivery_info.phone_number,
                instruction: delivery_info.instruction
            });
            
            await delivery.save();

            const order = new OrderModel({
                account_id: accountId,
                delivery_info: {},
                order_items: orderItems,
                shipping_fee: 0,
                status: 'Done',
                transaction_id: '000000',
            });

            await order.save();

            // Link order items to the order
            await OrderItemModel.updateMany({ _id: { $in: orderItems } }, { order_id: order._id });

            // Update user's order list
            await AccountModel.updateOne(
                { _id: accountId },
                { $push: { order_id: order._id } }
            );

            // Optionally clear the cart
            res.clearCookie('cart');

            res.status(200).json({ message: 'Order placed successfully', order });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while placing the order: ' + error.message});
        }
    }

    getPendingOrders = async (req, res) => {
        try {
            const pendingOrders = await OrderModel.find({ status: 'Pending' }).populate('account_id').populate('order_items').populate('shipping_fee').populate('completed_at');
            res.status(200).json(pendingOrders);
        } catch (error) {
            res.status(500).json({ error: 'Unable to fetch pending orders: ' + error.message });
        }
    };

    getApprovedOrders = async (req, res) => {
        try {
            const approveOrders = await OrderModel.find({ status: 'Approved' }).populate('account_id').populate('order_items').populate('shipping_fee').populate('completed_at');
            res.status(200).json(approveOrders);
        } catch (error) {
            res.status(500).json({ error: 'Unable to fetch pending orders: ' + error.message });
        }
    }

    approveOrder = async (req, res) => {
        try {
            const { orderId } = req.params.id;

            // Validate orderId
            if (!mongoose.Types.ObjectId.isValid(orderId)) {
                res.status(204).json({ message: 'Invalid order ID' });
                return;
            }

            // Find and update the order's status to "Approved"
            const updatedOrder = await OrderModel.findByIdAndUpdate(
                orderId,
                { status: 'Approved' },
                { new: true, runValidators: true }
            );

            if (!updatedOrder) {
                res.status(204).json({ message: 'Order not found' });
                return;
            }

            res.status(200).json(updatedOrder);
        } catch (error) {
            res.status(500).json({ error: 'Unable to approve order: ' + error.message });
        }
    };

    rejectOrder = async(req, res) => {
        try {
            const { orderId } = req.params.id;

            // Validate orderId
            if (!mongoose.Types.ObjectId.isValid(orderId)) {
                res.status(204).json({ message: 'Invalid order ID'});
                return;
            }

            // Find and update the order's status to "Approved"
            const updatedOrder = await OrderModel.findByIdAndUpdate(
                orderId,
                { status: 'Reject' },
                { new: true, runValidators: true }
            );

            if (!updatedOrder) {
                res.status(204).json({ message: 'Order not found' });
                return;
            }

            res.status(200).json(updatedOrder);
        } catch (error) {
            res.status(500).json({ error: 'Unable to approve order: ' + error.message });
        }
    }
}


module.exports = new OrderController();