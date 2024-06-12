const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const accountRoutes = require('./routes/accountRoutes');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors())

// Routes
app.use('/api', accountRoutes);

module.exports = app;