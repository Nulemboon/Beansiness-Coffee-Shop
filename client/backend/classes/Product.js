class Product {
    constructor(productID, name, description, price) {
        this.productID = productID;
        this.name = name;
        this.description = description;
        this.price = price;
    }
    
    equals(product) {
        return this.productID == product.productID;
    }
}

module.exports = Product;
