const express = require('express');

const app = express();

const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const cors = require('cors');
const route = require('./routes/index');

require('dotenv/config')

// Connect to the database
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(cors())

// Routes
route(app);

module.exports = app;