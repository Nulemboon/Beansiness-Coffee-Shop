const express = require('express');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const cors = require('cors');
const accountRoutes = require('./routes/accountRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

// // Connect to the database
// connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors())


// Routes
app.use('/api', accountRoutes);
cartRoutes.routes(app);

module.exports = app;