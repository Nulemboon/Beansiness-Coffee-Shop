const request = require("supertest");
const app = require("../app");
const { describe } = require("node:test");
require("dotenv").config();

describe("GET /cart", () => {
    it("Return all product", async() => {
        const res = await request(app).get('/cart');
        expect(res.statusCode).toBe(200);
    });
});

describe("POST /cart/add", () => {
    let cartCookies;
    it("Add item successfully", async() => {
        const res = await request(app).post('/cart/add').send({
            product: {
                productID: 1,
                name: 'cafe',
                desciption: 'none',
                price: 50000
            },
            listTopping: [
                {
                    toppingID: 1,
                    name: 'sugar',
                    description: 'none',
                    price: 5000
                },
            ],
            size: 'M',
            quantity: 1
        });
        expect(res.statusCode).toBe(200);
    });
});