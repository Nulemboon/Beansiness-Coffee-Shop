const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const cors = require('cors');
const route = require('./routes/index');

require('dotenv/config');

const app = express();

connectDB();

const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, 
};
  
app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Replace with your frontend domain
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials
    next();
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

  
// Routes
route(app);

module.exports = app;