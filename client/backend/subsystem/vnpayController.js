const moment = require('moment');
const config = require('./config/default.json');
const TransactionModel = require('../models/TransactionModel');

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

class VNPAY {

    createUrlPayment = async (req, res) => {
        try {
            var { amount, content } = req.body;
            amount = parseInt(amount);

            process.env.TZ = 'Asia/Ho_Chi_Minh';

            let date = new Date();
            let createDate = moment(date).format('YYYYMMDDHHmmss');

            let ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            // let ipAddr = "192.168.1.104";

            let tmnCode = config.vnp_TmnCode;
            let secretKey = config.vnp_HashSecret;
            let vnpUrl = config.vnp_Url;
            let returnUrl = config.vnp_ReturnUrl;
            let orderId = moment(date).format('DDHHmmss');
            let bankCode = "";

            let locale = 'vn';
            let currCode = 'VND';
            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            vnp_Params['vnp_Amount'] = amount * 100;
            vnp_Params['vnp_TxnRef'] = orderId;
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_OrderInfo'] = content;
            vnp_Params['vnp_OrderType'] = 'other';
            vnp_Params['vnp_Locale'] = locale;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            if (bankCode !== null && bankCode !== '') {
                vnp_Params['vnp_BankCode'] = bankCode;
            }

            vnp_Params = sortObject(vnp_Params);

            let querystring = require('qs');
            let signData = querystring.stringify(vnp_Params, { encode: false });
            let crypto = require("crypto");
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

            //res.status(200).json(vnpUrl);
            res.redirect(vnpUrl)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }

    }

    getResponse = async (req, res) => {
        try {
            let vnp_Params = req.query;

            let secureHash = vnp_Params['vnp_SecureHash'];

            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];

            vnp_Params = sortObject(vnp_Params);

            let tmnCode = config.vnp_TmnCode;
            let secretKey = config.vnp_HashSecret;

            let querystring = require('qs');
            let signData = querystring.stringify(vnp_Params, { encode: false });
            let crypto = require("crypto");
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

            if (secureHash == signed) {
                var orderId = vnp_Params['vnp_TxnRef'];
                var rspCode = vnp_Params['vnp_ResponseCode'];

                var amount = vnp_Params['vnp_Amount'];
                amount = parseInt(amount) / 100;
                var content = vnp_Params['vnp_OrderInfo'];
                var message = '';

                if (rspCode == "00") {
                    message = 'Payment is completed!';
                } else if (orderId == "04") {
                    message = 'Invalid amount';
                } else if (orderId == "99") {
                    message = 'Invalid request';
                } else {
                    message = 'Order is not completed, please try again!';
                }
                const newTransaction = TransactionModel({
                    amount: amount,
                    message: message,
                    transaction_content: content,
                    transaction_id: orderId,
                })

                newTransaction.save()
                    .then((savedTransaction) => {
                        res.json({ transactionId: savedTransaction._id });
                    })
                    .catch((err) => {
                        console.error('Error saving transaction:', err);
                        res.status(500).json({ error: 'Failed to save transaction' });
                    });;
            } else {
                res.status(200).json({message: 'Fail checksum' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }
}

module.exports = new VNPAY;