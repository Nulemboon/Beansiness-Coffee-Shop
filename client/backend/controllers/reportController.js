const OrderModel = require('../models/OrderModel');
const OrderItemModel = require('../models/OrderItemModel');
const mongoose = require('mongoose');
const ProductModel = require('../models/ProductModel');

class ReportController {
    getRevenuePerProduct = async (req, res) => {
        try {
            const { dateFrom, dateTo } = req.query;

            // Hoi ngu hoc nhg thoi ke me, ham aggregate nhu loz, dm 1 tieng cuoc doi

            const result = await OrderModel
                .find({ completed_at: { $gte: new Date(dateFrom + "T00:00:00.000Z"), $lte: new Date(dateTo + "T00:00:00.000Z") } })
                .populate({ path: 'order_items', populate: { path: 'product_id' } });

            var productMap = {};

            // loop through each order
            for (const order of result) {
                // loop through order item in result
                for (const item of order.order_items) {
                    const { product_id, quantity } = item;
                    const { name, price } = product_id;

                    if (product_id._id in productMap) {
                        productMap[product_id._id].revenue += quantity * price;
                    } else {
                        productMap[product_id._id] = {
                            product_name: name,
                            revenue: quantity * price,
                        };
                    }
                }
            }

            res.status(200).json(productMap);
        } catch (error) {
            res.status(500).json({ error: "An error occured why calculating revenue: " + error.message });
        }
    }

    getDailyRevenue = async (req, res) => {
        try {
            const { dateFrom, dateTo } = req.query;

            const result = await OrderModel
                .find({ completed_at: { $gte: new Date(dateFrom + "T00:00:00.000Z"), $lte: new Date(dateTo + "T00:00:00.000Z") } })
                .populate({ path: 'order_items', populate: { path: 'product_id' } });
            
            var dailyMap = {};

            // loop through each order
            for (const order of result) {
                // get order date
                const { completed_at } = order;
                var completed_date = completed_at.toLocaleDateString();

                if (!(completed_date in dailyMap)) dailyMap[completed_date] = 0;

                // loop through order item in result
                for (const item of order.order_items) {
                    const { product_id, quantity } = item;
                    const { price } = product_id;

                    dailyMap[completed_date] += price * quantity;
                }
            }

            res.status(200).json(dailyMap);
            // Result format:
            // {
            //      "6/27/2024": 468000,
            //      "6/28/2024": 500000
            // }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    getSalesPerDay = async (req, res) => {
        try {
            const { dateFrom, dateTo, prodId } = req.query;
            
            const result = await OrderModel
                .find({ completed_at: { $gte: new Date(dateFrom + "T00:00:00.000Z"), $lte: new Date(dateTo + "T00:00:00.000Z") } })
                .populate({ path: 'order_items', populate: { path: 'product_id' } });
            
            var dailyMap = {};

            // loop through each order
            for (const order of result) {
                // get order date
                const { completed_at } = order;
                var completed_date = completed_at.toLocaleDateString();

                if (!(completed_date in dailyMap)) dailyMap[completed_date] = 0;

                // loop through order item in result
                for (const item of order.order_items) {
                    const { quantity } = item;

                    dailyMap[completed_date] += quantity;
                }
            }

            res.status(200).json(dailyMap);
            // Result format:
            // {
            //      "6/27/2024": 12,
            //      "6/28/2024": 25
            // }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}


module.exports = new ReportController();