const VoucherModel = require('../models/VoucherModel.js');
const AccountModel = require('../models/AccountModel.js');
const { default: mongoose } = require('mongoose');

const getVoucher = async (req, res) => {
    try {
        const voucher = await VoucherModel.find();
        res.status(200).json(voucher);
    } catch (error) {
        res.status(500).json({ message: 'Unable to get Vouchers', error: error.message });
    }
}

const addVoucher = async (req, res) => {
    try {
        const { name, description, requiredPoints, discount } = req.body;

        const newVoucher = VoucherModel({
            name: name,
            description: description,
            required_points: requiredPoints,
            discount: discount
        });

        const savedVoucher = await newVoucher.save();
        res.status(200).json(savedVoucher);
    } catch (error) {
        res.status(500).json({ message: 'Unable to add voucher', error: error.message });
    }
}

const removeVoucher = async (req, res) => {
    try {
        const { voucherId } = req.params;

        // Validate voucherId
        if (!mongoose.Types.ObjectId.isValid(voucherId)) {
            return res.status(400).json({ message: 'Invalid voucher ID' });
        }

        // Delete the voucher by ID
        const deletedVoucher = await VoucherModel.findByIdAndDelete(voucherId);

        if (!deletedVoucher) {
            return res.status(404).json({ message: 'Voucher not found' });
        }

        res.status(200).json({ message: 'Voucher deleted successfully', voucher: deletedVoucher });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const addUserVoucher = async (req, res) => {
    try {
        const { accountId } = req.params.id;
        const { voucherId } = req.body;

        // Validate voucherId
        if (!mongoose.Types.ObjectId.isValid(voucherId)) {
            return res.status(400).json({ message: 'Invalid voucher ID' });
        }

        // Find the account by ID
        const account = await AccountModel.findById(accountId);

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Check if the voucher already exists in the account's vouchers list
        const existingVoucher = account.vouchers.find(v => v.voucher_id.equals(voucherId));

        if (existingVoucher) {
            // If the voucher exists, increase the quantity
            existingVoucher.quantity += 1;
        } else {
            // If the voucher does not exist, add a new one with quantity 1
            account.vouchers.push({ voucher_id: voucherId, quantity: 1 });
        }

        // Save the account with the updated vouchers list
        await account.save();

        res.status(200).json(account);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const removeUserVoucher = async (req, res) => {
    try {
        const { accountId } = req.params.id;
        const { voucherId } = req.body;

        // Validate voucherId
        if (!mongoose.Types.ObjectId.isValid(voucherId)) {
            return res.status(400).json({ message: 'Invalid voucher ID' });
        }

        // Find the account by ID
        const account = await AccountModel.findById(accountId);

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Find the voucher in the account's vouchers list
        const voucherIndex = account.vouchers.findIndex(v => v.voucher_id.equals(voucherId));
        if (voucherIndex === -1) {
            return res.status(404).json({ message: 'Voucher not found in account' });
        }

        const voucher = account.vouchers[voucherIndex];

        if (voucher.quantity > 1) {
            // Decrease the quantity if more than one
            account.vouchers[voucherIndex].quantity -= 1;
        } else {
            // Remove the voucher if only one left
            account.vouchers.splice(voucherIndex, 1);
        }

        // Save the account with the updated vouchers list
        await account.save();
        res.status(200).json(account);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getVoucher,
    addVoucher,
    removeVoucher,
    addUserVoucher,
    removeUserVoucher
}