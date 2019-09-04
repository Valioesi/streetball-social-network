/**
 * Model for User
 */

const mongoose = require('mongoose');
module.exports = mongoose.model('User', new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    friends: Array,
    notYetFriends: Array,
    friendRequests: Array
}));