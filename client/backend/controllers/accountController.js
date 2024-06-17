const AccountModel = require('../models/AccountModel.js');
const Account = require('../classes/Account.js');
const { default: mongoose } = require('mongoose');

const getAllAccounts = async (req, res) => {
    try {
        const accounts = await AccountModel.find();
        const accountList = accounts.map(account => new Account(account.name, account.email, account.password, account.orders));
        res.json(accountList);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching accounts.' });
    }
};

const getAccountById = async (req, res) => {
    try {
        const account = await AccountModel.findById(req.params.id);
        if (account) {
            const accountObj = new Account(account.name, account.email, account.password, account.orders);
            res.json(accountObj);
        } else {
            res.status(404).json({ error: 'Account not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the account.' });
    }
};

const getOrderHistory = async (req, res) => {
    try {
        const accountId = req.params.id;
        const result = await AccountModel.aggregate([
            {
                $match: {
                    _id: mongoose.Schema.Types.ObjectId(accountId)
                }
            },
            {
                $lookup: {
                    from: 'Order',
                    localField: 'orders',
                    foreignField: '_id',
                    as: 'orders'
                }
            },
            {
                $unwind: '$orders'
            },
            {
                $lookup: {
                    from: 'Product',
                    localField: 'orders.order_items.product_id',
                    foreignField: '_id',
                    as: 'orders.order_items.product'
                }
            },
            {
                $unwind: '$orders.order_items.product'
            },
            {
                $group: {
                    _id: {
                        orderId: '$orders._id',
                        orderDate: '$orders.completed_at'
                    },
                    order_items: {
                        $push: {
                            product_id: '$orders.order_items.product._id',
                            product_name: '$orders.order_items.product.name',
                            quantity: '$orders.order_items.quantity'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    orderId: '$_id.orderId',
                    completed_at: '$_id.orderDate',
                    order_items: 1
                }
            },
            {
                $sort: { completed_at: 1 }
            }
        ]);

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    getAllAccounts,
    getAccountById,
    getOrderHistory,
};