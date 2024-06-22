const DeliveryInfoModel = require('../models/DeliveryInfoModel');

class DeliveryInfoController {
    createDeliveryInfo = async (req, res) => {
        try {
            const { account_id } = req.user.id;
            const { receiver_name, address, phone_number, instruction } = req.body;

            const account = await AccountModel.find(account_id);

            if (!account) {
                res.status(204).json({ message: "Account not found"});
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

    deleteDeliveryInfo = async (req, res) => {
        try {
            const { deliveryInfo_id } = req.params;
            const { account_id } = req.user.id;

            const account = await AccountModel.find(account_id);

            if (!account) {
                res.status(204).json({ message: "Account not found"});
                return ;
            }

            const deletedDeliveryInfo = await DeliveryInfoModel.findByIdAndDelete(deliveryInfo_id);

            if (!deletedDeliveryInfo) {
                res.status(204).json({ message: 'Delivery Info not found' });
                return;
            }

            res.status(200).json({ message: 'Delivery Info has been deleted.'});
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while removing delivery info.' });
        }
        
    };

}


module.exports = new DeliveryInfoController();