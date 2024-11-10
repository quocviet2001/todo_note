const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tag = new Schema({
    category: { type: String},
    slug: { type: String, unique: true },
});

module.exports = mongoose.model('Tag', Tag);