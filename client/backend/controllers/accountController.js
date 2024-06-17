const AccountModel = require('../models/AccountModel');

class AccountController {
    getAllAccounts = async (req, res) => {
        try {
            const accounts = await AccountModel.find();
            // const accountList = accounts.map(account => new Account(account.name, account.email, account.password));
            res.json(accounts);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching accounts.' });
        }
    };
    
    getAccountById = async (req, res) => {
        try {
            const account = await AccountModel.findById(req.params.id);
            if (account) {
                // const accountObj = new Account(account.name, account.email, account.password);
                res.json(account);
            } else {
                res.status(404).json({ error: 'Account not found.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching the account.' });
        }
    };

    addAccount = async (req, res) => {
        try {
            const { name, phone, email, password } = req.body;
    
            const newAccount = AccountModel({
                name: name,
                phone: phone,
                email: email,
                password: password,
                point: 0,
                order_id: [],
                isBlock: false,
                vouchers: []
            });
    
            const savedAccount = await newAccount.save();
            res.status(200).json(savedAccount);
        } catch (error) {
            res.status(500).json({ message: 'Unable to add voucher', error: error.message});
        }
    }

    removeAccount = async (req, res) => {
        try {
            const { accountId } = req.params.id;
    
            // Validate voucherId
            if (!mongoose.Types.ObjectId.isValid(accountId)) {
                return res.status(400).json({ message: 'Invalid account ID' });
            }
    
            // Delete the voucher by ID
            const deletedAccount = await AccountModel.findByIdAndDelete(accountId);
    
            if (!deletedAccount) {
                return res.status(404).json({ message: 'Account not found' });
            }
    
            res.status(200).json({ message: 'Account deleted successfully', voucher: deletedAccount });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}


module.exports = new AccountController();