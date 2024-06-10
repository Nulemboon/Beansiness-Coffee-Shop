import CartItem from "./CartItem";

class Cart {
    private _productList: Array<CartItem>;

    constructor() {
        this._productList = new Array<CartItem>;
    }

    get productList(): Array<CartItem> {
        return this._productList;
    }

    public addItem(cartItem: CartItem) {
        var changed: boolean = false;
        this._productList.forEach((cartItem1) => {
            if (cartItem1.equals(cartItem)) {
                cartItem1.increase(cartItem.quantity);
                changed = true;
            }

        })
        if (changed) return;
        this._productList.push(cartItem);
    }

    public removeItem(cartItem: CartItem) {
        this._productList = this._productList.filter(cartItem1 => !cartItem1.equals(cartItem));
    }
}

export default Cart;