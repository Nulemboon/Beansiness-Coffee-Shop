const mongoose = require("mongoose");

const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://tri2003714:8825529tT@cluster0.tq9x0ib.mongodb.net/').then(()=>console.log("DB Connected"))
}

module.exports = connectDB;
