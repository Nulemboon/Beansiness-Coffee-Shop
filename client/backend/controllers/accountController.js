const AccountModel = require('../models/AccountModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');

class AccountController {
    getAllAccounts = async (req, res) => {
        try {
            const accounts = await AccountModel.find();

            if (!accounts || accounts.length === 0) {
                res.status(204).json({message: 'No account available'});
                return;
            }

            res.status(200).json({success: true, data: accounts});
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching accounts.' });
        }
    };
    
    getAccountById = async (req, res) => {
        try {
            const account = await AccountModel.findById(req.params.id);

            if (!account) {
                res.status(204).json({ message: 'Account not found.' });  
                return;
            } 

            res.status(200).json(account);
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
            // const token = createToken(savedAccount._id)
            res.status(200).json(savedAccount);
        } catch (error) {
            res.status(500).json({ error: 'Unable to add account: ' + error.message});
        }
    }

    removeAccount = async (req, res) => {
        try {
            const { accountId } = req.params.id;
    
            if (!mongoose.Types.ObjectId.isValid(accountId)) {
                throw new Error("Invalid account id");
                res.status(204).json({ message: 'Invalid account ID' });
                return;
            }
    
            // Delete the voucher by ID
            const deletedAccount = await AccountModel.findByIdAndDelete(accountId);
    
            if (!deletedAccount) {
                res.status(204).json({ message: 'Account not found' });
                return;
            }
    
            res.status(200).json(deletedAccount);
        } catch (error) {
            res.status(500).json({ message: 'Unable to remove account' + error.message});
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
                res.status(204).json({message: "Account does not exist"});
                return;
            }
    
            const isMatch = await bcrypt.compare(password, account.password)
    
            if(!isMatch){
                res.status(401).json({message: "Invalid credentials"});
                return;
            }
            
            if (account.isBlock) {
                res.json({message: "Account Blocked"});
                return;
            }
            
            const token = this.createToken(account._id)
            res.status(200).json(token)
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
                res.status(409).json({message: "User already exists"});
                return;
            }

            // validating email format & strong password
            if(!validator.isEmail(email)){
                res.status(409).json({message: "Please enter a valid email"});
                return;
            }

            if(password.length < 8){
                res.status(409).json({message: "Please enter a strong password"});
                return;
            }
            if(phone.length != 10) {
                res.status(409).json({message: "Please enter a valid phone number"});
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
                order_id: [],
                voucher: [],
                isBlock: false
            });

            const account = await newAccount.save();
            const token = createToken(account._id);
            res.status(200).json(token);
        } catch(error){
            res.status(500).json({error: "Error when register account" + error.message});
        }
    }

}


module.exports = new AccountController();