const OrderModel = require('../models/OrderModel');
const OrderItemModel = require('../models/OrderItemModel');

const getRevenuePerProduct = async (req, res) => {
    try {
        const { dateFrom, dateTo } = req.query;

        // Holy moly
        const result = await OrderModel.aggregate([
            {
                // Get order in date range
                $match: { completed_at: { $gte: new Date(dateFrom), $lte: new Date(dateTo) } },
            },
            {
                // Join OrderItem table
                $lookup: {
                    from: 'OrderItem',
                    localField: 'order_items',
                    foreignField: '_id',
                    as: 'order_items'
                },
            },
            {
                // Deconstruct multiple value
                $unwind: "$order_items"
            },
            {
                $group: {
                    _id: "$order_items.product_id",
                    totalQuantity: { $sum: "$order_items.quantity" }
                }
            },
            {
                $lookup: {
                    from: 'Product',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $project: {
                    _id: 0,
                    product_id: "$_id",
                    totalQuantity: 1,
                    product: { $arrayElemAt: ["$product", 0] }
                }
            },
            {
                $project: {
                    _id: 0,
                    product_name: "$product.name",
                    revenue: { $multiply: ["$totalQuantity", "$product.price"] }
                }
            }
        ]);

        // Format the result as JSON
        const formattedResult = result.map(item => ({
            product_name: item.product_name,
            revenue: item.revenue.toFixed(2)
        }));

        res.status(200).json(formattedResult);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getDailyRevenue = async (req, res) => {
    try {
        const { dateFrom, dateTo } = req.query;
        const result = await Order.aggregate([
            {
                $match: {
                    completed_at: {
                        $gte: new Date(dateFrom),
                        $lte: new Date(dateTo)
                    }
                }
            },
            {
                $lookup: {
                    from: 'orderitems',
                    localField: 'order_items',
                    foreignField: '_id',
                    as: 'order_items'
                }
            },
            { $unwind: "$order_items" },
            {
                $lookup: {
                    from: 'products',
                    localField: 'order_items.product_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: "$product" },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$completed_at" } },
                        product_id: "$product._id"
                    },
                    dailyRevenue: { $sum: { $multiply: ["$order_items.quantity", "$product.price"] } }
                }
            },
            {
                $group: {
                    _id: "$_id.date",
                    totalRevenue: { $sum: "$dailyRevenue" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Format the result as requested
        const formattedResult = result.map(item => ({
            day: item._id,
            revenue: item.totalRevenue.toFixed(2)
        }));

        res.status(200).json(formattedResult);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getSalesPerDay = async (req, res) => {
    try {
        const { dateFrom, dateTo } = req.query;
        const result = await Order.aggregate([
            {
                $match: {
                    completed_at: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $lookup: {
                    from: 'orderitems',
                    localField: 'order_items',
                    foreignField: '_id',
                    as: 'order_items'
                }
            },
            { $unwind: "$order_items" },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$completed_at" } },
                    totalQuantity: { $sum: "$order_items.quantity" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const formattedResult = result.map(item => ({
            day : item._id,
            quantity : item.totalQuantity
        }));

        res.status(200).json(formattedResult);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    getRevenuePerProduct,
    getDailyRevenue,
    getSalesPerDay
}