class DeliveryInfo {
    private _deliveryID: Number;
    private _receiverName: String;
    private _address: String;
    private _phoneNumber: String;
    private _instruction: String;

    constructor(receiverName: String, address: String, phoneNumber: String, instruction: String) {
        this._receiverName = receiverName;
        this._address = address;
        this._phoneNumber = phoneNumber;
        this._instruction = instruction;
    }

    set deliveryID(deliveryID: Number) {
        this._deliveryID = deliveryID;
    }
}

export default DeliveryInfo;