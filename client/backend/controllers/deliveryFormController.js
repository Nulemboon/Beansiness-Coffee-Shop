const DeliveryInfo = require('../dist/classes/DeliveryInfo');

const getDeliveryInfo = async(req, res) => {
    let deliveryInfo = req.cookies.deliveryInfo;
    if (!deliveryInfo) {
        // If not exit then create empty delivery info
        const emptyInfo = new DeliveryInfo('', '', '', '');
        saveDeliveryInfo(req, res, emptyInfo);
        deliveryInfo = JSON.stringify(emptyInfo);
    }

    const deliveryInfoObj = JSON.parse(deliveryInfo);
    return deliveryInfoObj;
}

const saveDeliveryInfo = async(req, res, deliveryInfo) => {
    res.cookie('deliveryInfo', JSON.stringify(deliveryInfo))
}

const submitDeliveryInfo = (req, res) => {
    try {
        const { receiverName, address, phoneNumber, instruction } = req.body;
        const deliveryInfo = new DeliveryInfo(receiverName, address, phoneNumber, instruction);

        // Save info
        saveDeliveryInfo(req, res, deliveryInfo);
        res.status(200).json(req.body);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {
    getDeliveryInfo,
    saveDeliveryInfo,
    submitDeliveryInfo
}