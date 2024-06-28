const moment = require('moment');
const config = require('./config/default.json');
const TransactionModel = require('../models/TransactionModel');
const crypto = require('crypto');
const querystring = require('qs');

function sortObject(obj) {
    let sorted = {};
    let str = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (let key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

class VNPAY {

    // Method to create the payment URL
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

            let tmnCode = config.vnp_TmnCode;
            let secretKey = config.vnp_HashSecret;
            let vnpUrl = config.vnp_Url;
            let returnUrl = config.vnp_ReturnUrl; // Make sure this is set correctly
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

            let signData = querystring.stringify(vnp_Params, { encode: false });
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

            res.status(200).json({ redirectUrl: vnpUrl });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    getResponse = async (req, res) => {
        console.log('Received VNPAY response:', req.query);
        try {
            let vnp_Params = req.query;
            let secureHash = vnp_Params['vnp_SecureHash'];

            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];

            vnp_Params = sortObject(vnp_Params);

            let signData = querystring.stringify(vnp_Params, { encode: false });
            let hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
            let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

            if (secureHash === signed) {
                let orderId = vnp_Params['vnp_TxnRef'];
                let rspCode = vnp_Params['vnp_ResponseCode'];
                let amount = vnp_Params['vnp_Amount'];
                amount = parseInt(amount) / 100; 
                let content = vnp_Params['vnp_OrderInfo'];
                let message = '';

                if (rspCode === "00") { 
                    message = 'success';
                } else if (rspCode === "04") { 
                    message = 'failed';
                } else if (rspCode === "99") { 
                    message = 'failed';
                } else { 
                    message = 'failed';
                }

                const newTransaction = new TransactionModel({
                    amount: amount,
                    message: message,
                    transaction_content: content,
                    transaction_id: orderId,
                });

                newTransaction.save()
                    .then((savedTransaction) => {
                        const redirectUrl = `http://localhost:5173/result?transactionId=${savedTransaction._id}`;
                        res.redirect(redirectUrl);
                    })
                    .catch((err) => {
                        res.status(500).json({ error: 'Failed to save transaction' });
                    });
            } else {
                res.status(400).json({ message: 'Invalid secure hash' });
            }
        } catch (error) {
            console.error('Error processing VNPAY response:', error);
            res.status(500).json({ error: error.message });
        }
    }

    
    getTransaction = async (req, res) => {
        try {
            const transactionId = req.params.id;
            const transaction = TransactionModel.findById(transactionId);
            
            if (!transaction) {
                res.status(404).json({ message: 'Transaction not found' });
                return;
            }

            res.status(200).json(transaction);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new VNPAY();