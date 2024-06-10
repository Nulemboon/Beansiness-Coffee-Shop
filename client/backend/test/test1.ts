import Product from "../models/Product";
import Topping from "../models/Topping";
import CartItem from "../models/CartItem";
import Cart from "../models/Cart";

var productList = new Array<Product>;
productList.push(new Product(1, "p1", "none", 1));
productList.push(new Product(2, "p2", "none", 2));
productList.push(new Product(3, "p3", "none", 3));
productList.push(new Product(4, "p4", "none", 4));
productList.push(new Product(5, "p5", "none", 5));

var toppingList = new Array<Topping>;
toppingList.push(new Topping(1, "t1", 1, "none"));
toppingList.push(new Topping(2, "t2", 2, "none"));
toppingList.push(new Topping(3, "t3", 3, "none"));

var cart = new Cart;
cart.addItem(new CartItem(productList[0], [toppingList[0], toppingList[1]], 2, 2)); // P1: 2
cart.addItem(new CartItem(productList[0], [toppingList[1], toppingList[0]], 3, 1)); // P2: 1
cart.addItem(new CartItem(productList[0], [toppingList[1], toppingList[0]], 2, 1)); // P1: 1
cart.addItem(new CartItem(productList[0], [toppingList[0], toppingList[2]], 2, 1)); // P3: 1
cart.addItem(new CartItem(productList[0], [toppingList[1], toppingList[0]], 2, 1)); // P1: 1
cart.removeItem(new CartItem(productList[0], [toppingList[0], toppingList[2]], 2, 1))

cart.productList.forEach(value => {
    console.log("Product_id: " + value.product.productID);

    var toping: String = new String("");
    value.listTopping.forEach(value1 => {
        toping = toping + value1.toppingID.toString() + " ";
    })
    console.log("Topping: " + toping);
    console.log("Quantity: " + value.quantity);
    console.log("Size: " + value.size);
    console.log("\n");
})
