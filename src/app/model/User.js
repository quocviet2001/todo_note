const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['Admin', 'User'], default: 'User'},
    avatar: {type: String, default:'/uploads/totoro.jpg'},
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', User);