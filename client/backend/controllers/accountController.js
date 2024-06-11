const AccountModel = require('../models/accountModel');
const Account = require('../classes/Account.ts');

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await AccountModel.find();
    const accountList = accounts.map(account => new Account(account.name, account.email, account.password));
    res.json(accountList);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching accounts.' });
  }
};

const getAccountById = async (req, res) => {
  try {
    const account = await AccountModel.findById(req.params.id);
    if (account) {
      const accountObj = new Account(account.id, account.name, account.email);
      res.json(accountObj);
    } else {
      res.status(404).json({ error: 'Account not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the account.' });
  }
};

module.exports = {
  getAllAccounts,
  getAccountById,
};