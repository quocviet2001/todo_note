const mongoose = require('mongoose');

// Connect to DataBase
async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1/todo_note_dev');
        console.log("Connected DataBase Sucessfull !!!");
    } catch (error) {
        console.log("Error connected !!!");
    }
};

module.exports  = {connect};
