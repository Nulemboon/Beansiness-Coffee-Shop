class Product {
    private _productID: number;
    private _name: String;
    private _description: String;
    private _price: number;

    constructor(productID: number, name: String, description: String, price: number) {
        this._productID = productID;
        this._name = name;
        this._description = description;
        this._price = price;
    }

    get productID(): number {
        return this._productID;
    }

    equals(product: Product): boolean {
        return this.productID == product.productID;
    }
}

export default Product;