const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;

// Connect to DataBase
async function connect() {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected DataBase Sucessfull !!!");
    } catch (error) {
        console.log("Error connected !!!");
    }
};

module.exports  = {connect};
