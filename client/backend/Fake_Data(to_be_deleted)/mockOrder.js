const mockOrders = [
    {
    id: 1,
    createdAt: '2024-06-15T14:48:00.000Z',
    items: [
    { name: 'Espresso', quantity: 2 },
    { name: 'Cappuccino', quantity: 1 },
    { name: 'Iced Latte', quantity: 1 },
    ],
    amount: 18,
    status: 'Delivered'
    },
    {
    id: 2,
    createdAt: '2024-06-16T10:22:00.000Z',
    items: [
    { name: 'Green Tea', quantity: 2 },
    { name: 'Matcha Latte', quantity: 1 },
    { name: 'Chai Tea', quantity: 2 },
    ],
    amount: 22,
    status: 'In Progress'
    },
    {
    id: 3,
    createdAt: '2024-06-17T08:00:00.000Z',
    items: [
    { name: 'Smoothie - Berry Blast', quantity: 1 },
    { name: 'Cold Brew', quantity: 2 },
    { name: 'Hot Chocolate', quantity: 1 },
    ],
    amount: 24,
    status: 'Cancelled'
    },
    {
    id: 4,
    createdAt: '2024-06-18T09:30:00.000Z',
    items: [
    { name: 'Americano', quantity: 1 },
    { name: 'Flat White', quantity: 1 },
    { name: 'Mocha', quantity: 2 },
    ],
    amount: 20,
    status: 'Delivered'
    },
    {
    id: 5,
    createdAt: '2024-06-19T11:45:00.000Z',
    items: [
    { name: 'Lemonade', quantity: 3 },
    { name: 'Iced Tea - Peach', quantity: 2 },
    { name: 'Frappuccino', quantity: 1 },
    ],
    amount: 28,
    status: 'In Progress'
    },
    {
        id: 6,
        createdAt: '2024-07-19T12:45:00.000Z',
        items: [
        { name: 'Lemonade', quantity: 3 },
        { name: 'Iced Tea - Peach', quantity: 2 },
        { name: 'Frappuccino', quantity: 1 },
        ],
        amount: 28,
        status: 'In Delivery'
        }
    ];
    
    export default mockOrders;