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

    // Method to handle the VNPAY response
    getResponse = async (req, res) => {
        console.log('Received VNPAY response:', req.query);
        try {
            let vnp_Params = req.query;

            // Extract the secure hash from the query parameters
            let secureHash = vnp_Params['vnp_SecureHash'];

            // Remove the secure hash from the parameters to prepare for validation
            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];

            // Sort the remaining parameters
            vnp_Params = sortObject(vnp_Params);

            // Generate the secure hash for validation
            let signData = querystring.stringify(vnp_Params, { encode: false });
            let hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
            let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

            // Validate the secure hash
            if (secureHash === signed) {
                let orderId = vnp_Params['vnp_TxnRef'];
                let rspCode = vnp_Params['vnp_ResponseCode'];
                let amount = vnp_Params['vnp_Amount'];
                amount = parseInt(amount) / 100; // Convert to original amount
                let content = vnp_Params['vnp_OrderInfo'];
                let message = '';

                // Determine the redirect URL based on the response code
                let redirectUrl = '/transaction/error'; // Default to error page

                if (rspCode === "00") { // Payment success
                    message = 'Payment is completed!';
                    redirectUrl = '/transaction/success';
                } else if (rspCode === "04") { // Invalid amount
                    message = 'Invalid amount';
                    redirectUrl = '/transaction/failure';
                } else if (rspCode === "99") { // Invalid request
                    message = 'Invalid request';
                    redirectUrl = '/transaction/failure';
                } else { // Other errors
                    message = 'Order is not completed, please try again!';
                    redirectUrl = '/transaction/failure';
                }

                // Save the transaction details to the database
                const newTransaction = new TransactionModel({
                    amount: amount,
                    message: message,
                    transaction_content: content,
                    transaction_id: orderId,
                });

                newTransaction.save()
                    .then((savedTransaction) => {
                        console.log('Transaction saved, redirecting to:', redirectUrl);
                        // Redirect to the appropriate page with the transaction ID
                        res.redirect(`${redirectUrl}?transactionId=${savedTransaction._id}`);
                    })
                    .catch((err) => {
                        console.error('Error saving transaction:', err);
                        res.status(500).json({ error: 'Failed to save transaction' });
                    });
            } else {
                // If the secure hash is invalid, respond with an error
                res.status(400).json({ message: 'Invalid secure hash' });
            }
        } catch (error) {
            console.error('Error processing VNPAY response:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new VNPAY();
