const express = require('express');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const cors = require('cors');

const accountRoutes = require('./routes/accountRoutes');
const cartRoutes = require('./routes/cartRoutes');
const deliveryFormRoutes = require('./routes/deliveryFormRoutes');
const productRoutes = require('./routes/productRoutes.js');
const managerRoutes = require('./routes/managerRoutes.js');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors())


// Routes
// app.use('/api', accountRoutes);

cartRoutes.routes(app);
accountRoutes.routes(app);
deliveryFormRoutes.routes(app);
productRoutes.routes(app);
managerRoutes.routes(app);


module.exports = app;