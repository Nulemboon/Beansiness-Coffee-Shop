const OrderModel = require('../models/OrderModel.js');
const DeliveryInfoModel = require('../models/DeliveryInfoModel');
const AccountModel = require('../models/AccountModel.js');
const ProductModel = require('../models/ProductModel.js');
const OrderItemModel = require('../models/OrderItemModel.js');


class OrderController {
    getAllOrders = async (req, res) => {
        try {
            const orders = await OrderModel
                .find()
                .populate('account_id')
                .populate({path: 'order_items', populate: {path: 'product_id'}})
                .populate({path: 'order_items', populate: {path: 'toppings'}})
                .populate('delivery_info').populate('voucher_id');
                
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching orders: ' + error.message});
        }
    };

    getOrderById = async (req, res) => {
        try {
            const order = await OrderModel.findById(req.params.id)
                .populate({path: 'order_items', populate: {path: 'product_id'}})
                .populate({path: 'order_items', populate: {path: 'toppings'}})
                .populate('delivery_info').populate('voucher_id');

            if (!order) {
                res.status(404).json({ message: 'Order not found.' });
                return;
            }

            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching the order: ' + error.message});
        }
    };

    async placeOrder(req, res) {
        try {
            const { deliveryId, shippingFee, transactionId, voucherId } = req.body;
            const cart = JSON.parse(req.cookies.cart);

            if (!cart || cart.length === 0) {
                res.status(400).json({ message: 'Cart is empty' }); 
                return;
            }

            const accountId = req.user.id; // Assuming you have user authentication middleware

            const orderItems = [];
            let totalAmount = 0;

            for (const item of cart) {
                const product = await ProductModel.findById(item.productId);

                if (!product) {
                    return res.status(404).json({ message: `Product not found: ${item.productId}` });
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

            // const delivery = new DeliveryInfoModel({
            //     receiver_name: delivery_info.receiver_name,
            //     address: delivery_info.address,
            //     phone_number: delivery_info.phone_number,
            //     instruction: delivery_info.instruction  
            // });
            // await delivery.save();

            const order = new OrderModel({
                account_id: accountId,
                delivery_info: deliveryId,
                order_items: orderItems,
                shipping_fee: parseInt(shippingFee),
                status: 'Pending', // Initial order status
                transaction_id: transactionId,
                voucherId: voucherId
            });

            await order.save();

            // Link order items to the order
            await OrderItemModel.updateMany({ _id: { $in: orderItems } }, { order_id: order._id });

            // Update user's order list
            await AccountModel.updateOne(
                { _id: accountId },
                { 
                    $push: { order_id: order._id },
                    $inc: { point: Math.floor(totalAmount/10000) }
                }
            );

            
            // res.clearCookie('cart');

            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while placing the order: ' + error.message});
        }
    }

    async offlineOrder(req, res) {
        try {
            const { phone } = req.body;
            const cart = req.cookies.cart;

            if (!cart || cart.length === 0) {
                res.status(400).json({ message: 'Cart is empty' });
                return;
            }

            const account = await AccountModel.findOne({ phone: phone });
            
            const orderItems = [];
            let totalAmount = 0;

            for (const item of cart) {
                const product = await ProductModel.findById(item._id);

                if (!product) {
                    res.status(404).json({ message: `Product not found: ${item._id}` });
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

            const order = new OrderModel({
                account_id: account ? account._id : req.user.id,
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
                { _id: account ? account._id : req.user.id},
                { 
                    $push: { order_id: order._id },
                    $inc: { point: Math.floor(totalAmount / 10000) }
                }
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
                res.status(400).json({ message: 'Invalid order ID' });
                return;
            }

            // Find and update the order's status to "Approved"
            const updatedOrder = await OrderModel.findByIdAndUpdate(
                orderId,
                { status: 'Approved' },
                { new: true, runValidators: true }
            );

            if (!updatedOrder) {
                res.status(404).json({ message: 'Order not found' });
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
                res.status(400).json({ message: 'Invalid order ID'});
                return;
            }

            // Find and update the order's status to "Approved"
            const updatedOrder = await OrderModel.findByIdAndUpdate(
                orderId,
                { status: 'Reject' },
                { new: true, runValidators: true }
            );

            if (!updatedOrder) {
                res.status(404).json({ message: 'Order not found' });
                return;
            }

            res.status(200).json(updatedOrder);
        } catch (error) {
            res.status(500).json({ error: 'Unable to approve order: ' + error.message });
        }
    };


}


module.exports = new OrderController();