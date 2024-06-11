const express = require('express');
const accountRoutes = require('./routes/accountRoutes');
const connectDB = require('./config/database');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors())

// Routes
app.use('/api', accountRoutes);

module.exports = app;