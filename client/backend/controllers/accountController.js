const AccountModel = require('../models/AccountModel');
const StaffModel = require('../models/StaffModel');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const mongoose = require('mongoose');

class AccountController {
    getAllAccounts = async (req, res) => {
        try {
            const accounts = await AccountModel.find();

            if (!accounts || accounts.length === 0) {
                res.status(404).json({message: 'No account available'});
                return;
            }

            res.status(200).json(accounts);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching accounts: ' + error.message });
        }
    };
    
    getAccountById = async (req, res) => {
        try {
            const account = await AccountModel.findById(req.params.id).populate({
                path: 'vouchers.voucher_id',
                model: 'Voucher',
            });

            if (!account) {
                res.status(404).json({ message: 'Account not found.' });  
                return;
            } 

            res.status(200).json(account);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching the account: ' + error.message });
        }
    };

    addAccount = async (req, res) => {
        try {
            const { name, phone, email, password } = req.body;
            
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
            // const token = createToken(savedAccount._id)
            res.status(200).json(savedAccount);
        } catch (error) {
            res.status(500).json({ error: 'Unable to add account: ' + error.message});
        }
    }

    removeAccount = async (req, res) => {
        try {
            const accountId = req.params.id;
    
            if (!mongoose.Types.ObjectId.isValid(accountId)) {
                res.status(400).json({ message: 'Account Id is invalid' });
                return;
            }
    
            // Delete the voucher by ID
            const deletedAccount = await AccountModel.findByIdAndDelete(accountId);
    
            if (!deletedAccount) {
                res.status(404).json({ message: 'Account not found' });
                return;
            }
    
            res.status(200).json({ message: 'Account has been removed successfully.'});
        } catch (error) {
            res.status(500).json({ message: 'Unable to remove account: ' + error.message});
        }
    }

    createToken = (id, role) => {
        return jwt.sign({id, role}, process.env.JWT_SECRET);
    }
    
    //login user
    loginUser = async (req,res) => {
        const {phone, password} = req.body;
        try{
            const account = await AccountModel.findOne({phone})
    
            if(!account){
                res.status(404).json({message: "Account does not exist"});
                return;
            }
    
            const isMatch = await bcrypt.compare(password, account.password)
    
            if(!isMatch){
                res.status(400).json({message: "Invalid credentials"});
                return;
            }
            
            if (account.isBlock) {
                res.status(403).json({message: "Account Blocked"});
                return;
            }

            const staff = await StaffModel.findOne({ account_id: user._id });
            const role = staff ? staff.role : 'Customer';
            
            const token = this.createToken(account._id, role);
            res.status(200).json(token, role);
        } catch (error) {
            res.status(500).json({error: 'Login failed: ' + error.message});
        }
    }
    
    //register user
    registerUser = async (req,res) => {
        const {name, phone, email, password} = req.body;
        try{
            //check if user already exists
            const exists = await AccountModel.findOne({phone});

            if(exists){
                res.status(409).json({message: "User already exists"});
                return;
            }

            // validating email format & strong password
            if(!validator.isEmail(email)){
                res.status(400).json({message: "Please enter a valid email"});
                return;
            }

            // if(password.length < 8){
            //     res.status(409).json({message: "Please enter a strong password"});
            //     return;
            // }
            if(phone.length != 10) {
                res.status(400).json({message: "Please enter a valid phone number"});
                return;
            }
    
            // hashing user password
            const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
            const hashedPassword = await bcrypt.hash(password, salt);
    

            const newAccount = new AccountModel({
                name: name,
                phone: phone, 
                email: email, 
                password: hashedPassword,
                point: 0,
                order_id: [],
                voucher: [],
                isBlock: false
            });
            const role = 'Customer';
            const account = await newAccount.save();
            const token = this.createToken(account._id, role);

            res.status(200).json({token: token, role: role});

        } catch(error){
            res.status(500).json({error: "Error when register account: " + error.message});
        }
    }

}


module.exports = new AccountController();