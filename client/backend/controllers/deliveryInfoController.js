const DeliveryInfoModel = require('../models/DeliveryInfoModel');
const AccountModel = require('../models/AccountModel');

class DeliveryInfoController {
    createDeliveryInfo = async (req, res) => {
        try {
            const account_id = req.user.id;
            const { receiverName, address, phoneNumber, instruction } = req.body;

            const account = await AccountModel.findById(account_id);

            if (!account) {
                res.status(404).json({ message: "Account not found"});
                return ;
            }

            const deliveryInfo = await DeliveryInfoModel({
                receiver_name: receiverName,
                address: address,
                phone_number: phoneNumber,
                instruction: instruction || "",
            });

            const savedDeliveryInfo = await deliveryInfo.save();

            account.delivery_info.clear();
            account.delivery_info.push(savedDeliveryInfo._id);

            await account.save();

            res.status(200).json(savedDeliveryInfo);

        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating delivery info: ' + error.message });
        }
    };

    deleteUserDeliveryInfo = async (req, res) => {
        try {
            const deliveryInfo_id = req.params.id;
            const account_id = req.user.id;

            const account = await AccountModel.findById(account_id);

            if (!account) {
                res.status(404).json({ message: "Account not found"});
                return ;
            }
            
            const deliveryInfoIndex = account.delivery_info.findIndex(d => { return d.equals(deliveryInfo_id)});
            if (deliveryInfoIndex === -1) {
                res.status(404).json({ message: 'Delivery info not found in account' });
                return;
            }

            account.delivery_info.splice(deliveryInfoIndex);
            await account.save();

            // Remove delivery info from delivery table
            await DeliveryInfoModel.findByIdAndDelete(deliveryInfo_id);

            res.status(200).json({ message: 'Delivery Info has been deleted.'});
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while removing delivery info: ' + error.message});
        }
        
    };

}


module.exports = new DeliveryInfoController();