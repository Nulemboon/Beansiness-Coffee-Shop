class Account {
    private _name: String;
    private _number: String;
    private _password: String;

    constructor(name: String, number: String, password: String) {
        this._name = name;
        this._number = number;
        this._password = password;
    }
}

export default Account;