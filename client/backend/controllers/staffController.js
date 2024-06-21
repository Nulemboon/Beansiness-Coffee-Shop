const AccountModel = require('../models/AccountModel');
const StaffModel = require('../models/StaffModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class StaffController {
    getStaffById = async (req, res) => {
        try {
            const staff = await StaffModel.findById(req.params.id);
            if (staff) {
                // const accountObj = new Account(account.name, account.email, account.password);
                res.json(staff);
            } else {
                res.status(404).json({ error: 'Account not found.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching the account.' });
        }
    };

    addStaff = async (req, res) => {
        try {
            const { name, phone, email, password, role } = req.body;
            
            const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
            const hashedPassword = await bcrypt.hash(password, salt);

            const newAccount = AccountModel({
                name: name,
                phone: phone,
                email: email,
                password: hashedPassword,
                point: 0,
                order_id: [],
                isBlock: false,
                vouchers: []
            });
    
            const savedAccount = await newAccount.save();
            const token = createToken(savedAccount._id)
            
            const newStaff = StaffModel({
                account_id: savedAccount._id,
                role: role
            })

            await newStaff.save();

            res.json({success:true,token})
        } catch (error) {
            res.status(500).json({ message: 'Unable to add account', error: error.message});
        }
    }

    removeStaff = async (req, res) => {
        try {
            const { accountId } = req.params.id;
    
            // Validate voucherId
            if (!mongoose.Types.ObjectId.isValid(accountId)) {
                return res.status(400).json({ message: 'Invalid account ID' });
            }
    
            // Delete the voucher by ID
            const deletedStaff = await StaffModel.findByIdAndDelete(accountId);
 
            if (!deletedStaff) {
                return res.status(404).json({ message: 'Staff not found' });
            }
    
            const deletedAccount = await AccountModel.findByIdAndDelete(accountId);
    
            if (!deletedAccount) {
                return res.status(404).json({ message: 'Account not found' });
            }
    
            res.status(200).json({ message: 'Account deleted successfully', acccount: deletedAccount });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    createToken = (id) => {
        return jwt.sign({id}, process.env.JWT_SECRET);
    }
 
}


module.exports = new StaffController();