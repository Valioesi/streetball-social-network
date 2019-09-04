/**
 * model for court session
 */
const mongoose = require('mongoose');
module.exports = mongoose.model('Session', new mongoose.Schema({
    owner: String,
    time: Date,
    court: Object,
    players: Array
}));
