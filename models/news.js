const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema ({
    title: { type: String, required: true },
    author: { type: String },
    snippet: { type: String, required: true },
    body: { type: String, required: true },
    img: { type: String, required: true }
}, {timestamps: true, collection: 'news'});

const News = mongoose.model('News', newsSchema);
module.exports = News; 