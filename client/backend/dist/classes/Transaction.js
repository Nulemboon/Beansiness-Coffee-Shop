"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Transaction {
    constructor(transactionID, amount, content) {
        this._transactionID = transactionID;
        this._amount = amount;
        this._content = content;
    }
}
exports.default = Transaction;
