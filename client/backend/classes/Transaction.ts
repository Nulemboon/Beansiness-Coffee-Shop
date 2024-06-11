class Transaction {
    private _transactionID: Number;
    private _amount: Number;
    private _content: String;

    constructor(transactionID: Number, amount: Number, content: String) {
        this._transactionID = transactionID;
        this._amount = amount;
        this._content = content;
    }
}

export default Transaction;