const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    hash_pass: {
        type: String,
    },
    phone_num: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    last_entry: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);