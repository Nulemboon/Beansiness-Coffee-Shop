"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeliveryInfo {
    constructor(deliveryID, receiverName, address, phoneNumber, instruction) {
        this._deliveryID = deliveryID;
        this._receiverName = receiverName;
        this._address = address;
        this._phoneNumber = phoneNumber;
        this._instruction = instruction;
    }
    set deliveryID(deliveryID) {
        this._deliveryID = deliveryID;
    }
}
exports.default = DeliveryInfo;
