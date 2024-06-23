const VoucherModel = require('../models/VoucherModel.js');
const AccountModel = require('../models/AccountModel.js');
const { default: mongoose } = require('mongoose');

class VoucherController {
    getVoucher = async (req, res) => {
        try {
            const voucher = await VoucherModel.find();
            res.status(200).json(voucher);
        } catch (error) {
            res.status(500).json({ message: 'Unable to get Vouchers', error: error.message });
        }
    }

    addVoucher = async (req, res) => {
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

    removeVoucher = async (req, res) => {
        try {
            const voucherId = req.params.id;

            // Validate voucherId
            if (!mongoose.Types.ObjectId.isValid(voucherId)) {
                res.status(400).json({ message: 'Invalid voucher ID' });
                return;
            }

            // Delete the voucher by ID
            const deletedVoucher = await Voucher.findByIdAndDelete(voucherId);

            if (!deletedVoucher) {
                res.status(404).json({ message: 'Voucher not found' });
                return;
            }

            res.status(200).json({ message: 'Voucher has been deleted.' });
        } catch (error) {
            res.status(500).json({ error: 'Unable to remove voucher: ' + error.message });
        }
    }

    // Buy voucher
    // When a voucher is added to user:
    // - Check if user has enough point to buy voucher
    // - Reduce user point after buying
    addVoucherUser = async (req, res) => {
        try {
            const accountId = req.user.id;
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

            const voucher = await VoucherModel.findById(voucherId);

            // Check if the user can buy voucher
            if (account.point < voucher.required_points) {
                res.status(400).json({ message: 'User does not have enough point to buy voucher.' });
                return;
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

            // Reduce user's point
            account.point -= voucher.required_points;

            // Save the account with the updated vouchers list
            await account.save();

            res.status(200).json({ message: 'Voucher has been added.' });

        } catch (error) {
            res.status(500).json({ error: 'Unable to add voucher: ' + error.message });
        }
    }

    removeVoucherUser = async (req, res) => {
        try {
            const accountId = req.user.id;
            const { voucherId } = req.params;

            // Validate voucherId
            if (!mongoose.Types.ObjectId.isValid(voucherId)) {
                res.status(400).json({ message: 'Invalid voucher ID' });
                return;
            }

            // Find the account by ID
            const account = await AccountModel.findById(accountId);

            if (!account) {
                res.status(404).json({ message: 'Account not found' });
                return
            }

            // Find the voucher in the account's vouchers list
            const voucherIndex = account.vouchers.findIndex(v => v.voucher_id.equals(voucherId));
            if (voucherIndex === -1) {
                res.status(404).json({ message: 'Voucher not found in account' });
                return;
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

    getVoucherUser = async (req, res) => {
        try {
            // const accountId = req.user.id;
            const accountId = req.params.id;

            const result = await AccountModel.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(accountId) }
                },
                {
                    $lookup: {
                        from: 'Voucher',
                        localField: 'vouchers.voucher_id',
                        foreignField: '_id',
                        as: "vouchers"
                    }
                },
                // {
                //     $unwind: "$vouchers"
                // },
                // {
                //     $project: {
                //         _id: "$vouchers._id",
                //         name: "$vouchers.name",
                //         description: "$vouchers.description",
                //         discount: "vouchers.discount",
                //         quantity: "$voucherInfo.quantity"
                //     }
                // }
            ]);

            res.status(200).json(result);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new VoucherController();
