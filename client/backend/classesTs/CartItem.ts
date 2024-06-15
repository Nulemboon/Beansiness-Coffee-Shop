import Product from "./Product";
import Topping from "./Topping";


class CartItem {
    private _product: Product;
    private _listTopping: Array<Topping>;
    private _size: number;

    private _quantity: number;
    
    constructor(product: Product, listTopping: Array<Topping>, size: number, quantity: number) {
        this._product = product
        this._listTopping = listTopping.sort((a: Topping, b: Topping) => a.toppingID - b.toppingID);
        this._quantity = quantity;
        this._size = size;
    }

    get product(): Product {
        return this._product;
    }

    get listTopping(): Array<Topping> {
        return this._listTopping;
    }

    get quantity(): number {
        return this._quantity;
    }

    get size(): number {
        return this._size;
    }

    increase(quantity: number) {
        this._quantity += quantity;
    }

    decrease(quantity: number) {
        if (quantity >= this._quantity) throw new Error("ERROR: Can not decrease item quantity by: " + quantity);
        this._quantity -= quantity;
    }

    equals(cartItem: CartItem): boolean {
        // Check if item has equal size
        if (this._size != cartItem.size) return false;
        // Check if item has the same topping
        if (this._listTopping.length != cartItem.listTopping.length) return false;

        for (var i = 0; i < this._listTopping.length; i++) 
            if (this._listTopping[i] != cartItem.listTopping[i]) return false;

        return this.product.equals(cartItem.product);
    }
}

export default CartItem;
