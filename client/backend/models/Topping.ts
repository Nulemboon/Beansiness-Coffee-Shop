class Topping {
    private _toppingID: number;
    private _name: String;
    private _price: number;
    private _description: String;

    constructor(toppingID: number, name: String, price: number, description: String) {
        this._toppingID = toppingID;
        this._name = name;
        this._price = price;
        this._description = description;
    }

    get toppingID(): number {
        return this._toppingID
    }

    equals(topping: Topping): boolean {
        return this._toppingID == topping.toppingID;
    }
}

export default Topping;