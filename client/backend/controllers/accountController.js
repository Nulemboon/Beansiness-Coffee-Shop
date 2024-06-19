const AccountModel = require('../models/AccountModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');

class AccountController {
    getAllAccounts = async (req, res) => {
        try {
            const accounts = await AccountModel.find();

            if (!accounts || accounts.length === 0) {
                res.json({success: false, message: 'No account available'})
            }

            res.json({success: true, data: accounts});
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
            res.json({success:true,token})
        } catch (error) {
            res.status(500).json({ message: 'Unable to add account', error: error.message});
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
    
            res.status(200).json({ message: 'Account deleted successfully', account: deletedAccount });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    createToken = (id) => {
        return jwt.sign({id}, process.env.JWT_SECRET);
    }
    
    //login user
    loginUser = async (req,res) => {
        console.log(req.body);
        const {phone, password} = req.body;
        try{
            const account = await AccountModel.findOne({phone})
    
            if(!account){
                return res.json({success:false,message: "Account does not exist"})
            }
    
            const isMatch = await bcrypt.compare(password, account.password)
    
            if(!isMatch){
                return res.json({success:false,message: "Invalid credentials"})
            }
    
            const token = this.createToken(account._id)
            res.json({success:true,token})
        } catch (error) {
            console.log(error);
            res.json({success:false,message:"Error"})
        }
    }
    
    //register user
    registerUser = async (req,res) => {
        const {name, phone, email, password} = req.body;
        try{
            //check if user already exists
            const exists = await AccountModel.findOne({phone});

            if(exists){
                return res.json({success:false,message: "User already exists"});
            }
            // validating email format & strong password
            if(!validator.isEmail(email)){
                return res.json({success:false,message: "Please enter a valid email"});
            }
            if(password.length < 8){
                return res.json({success:false,message: "Please enter a strong password"});
            }
            if(phone.length != 10) {
                return res.json({success:false,message: "Please enter a valid phone number"});
            }
    
            // hashing user password
            const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
            const hashedPassword = await bcrypt.hash(password, salt);
    
            const newAccount = new AccountModel({
                name: name,
                phone: phone, 
                email: email, 
                password: hashedPassword,
                order_id: [],
                voucher: [],
                isBlock: false
            });
            const account = await newAccount.save()
            const token = createToken(account._id)
            res.json({success:true,token})
        } catch(error){
            console.log(error);
            res.json({success:false,message:"Error"})
        }
    }

}


module.exports = new AccountController();