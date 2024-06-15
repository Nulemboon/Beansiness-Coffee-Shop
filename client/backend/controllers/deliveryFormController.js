const DeliveryInfo = require('../classes/DeliveryInfo');

const getDeliveryInfo = async(req, res) => {
    let deliveryInfoJson = req.cookies.delivery;
    if (!deliveryInfoJson) {
        // If not exit then create empty delivery info
        const emptyInfo = new DeliveryInfo('', '', '', '');
        saveDeliveryInfo(req, res, emptyInfo);
        deliveryInfoJson = JSON.stringify(emptyInfo);
    }

    const deliveryInfoObj = JSON.parse(deliveryInfoJson);
    return deliveryInfoObj;
}

const saveDeliveryInfo = async(req, res, deliveryInfo) => {
    res.cookie('delivery', JSON.stringify(deliveryInfo))
}

const submitDeliveryInfo = async(req, res) => {
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