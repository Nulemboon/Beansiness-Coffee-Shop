const DeliveryInfoModel = require('../models/DeliveryInfoModel');

class DeliveryInfoController {
    createDeliveryInfo = async (req, res) => {
        try {
            const account_id = req.user.id;
            const { receiver_name, address, phone_number, instruction } = req.body;

            const account = await AccountModel.find(account_id);

            if (!account) {
                res.status(404).json({ message: "Account not found"});
                return ;
            }

            const deliveryInfo = await DeliveryInfoModel({
                receiver_name: receiver_name,
                address: address,
                phone_number: phone_number,
                instruction: instruction || "",
            });

            const savedDeliveryInfo = await deliveryInfo.save();

            account.delivery_info.push({
                delivery_id: savedDeliveryInfo._id,
            });

            await account.save();

            res.status(200).json(deliveryInfo);

        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating delivery info.' });
        }
    };

    deleteUserDeliveryInfo = async (req, res) => {
        try {
            const deliveryInfo_id = req.params.id;
            const account_id = req.user.id;

            const account = await AccountModel.find(account_id);

            if (!account) {
                res.status(404).json({ message: "Account not found"});
                return ;
            }
            
            const deliveryInfoIndex = account.delivery_info.findIndex(d => d.delivery_info.equals(deliveryInfo_id));
            if (deliveryInfoIndex === -1) {
                res.status(404).json({ message: 'Delivery info not found in account' });
                return;
            }

            account.delivery_info.splice(deliveryInfoIndex);
            await account.save();

            res.status(200).json({ message: 'Delivery Info has been deleted.'});
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while removing delivery info.' });
        }
        
    };

}


module.exports = new DeliveryInfoController();