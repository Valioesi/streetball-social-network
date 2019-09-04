/**
 * model for court location
 */
const mongoose = require('mongoose');
module.exports = mongoose.model('Court', new mongoose.Schema({
    name: String,
    city: String,
    address: String,
    baskets: Number,
    players: Array
}));
