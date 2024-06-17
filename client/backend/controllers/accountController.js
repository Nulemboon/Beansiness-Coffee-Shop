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

    
}


module.exports = new AccountController();