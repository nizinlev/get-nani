const mongoose = require('mongoose');

const naniSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    residence: {
        type: String,
        required: true
    },
    experience_years: {
        type: Number,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
});
module.exports = mongoose.model('Nani', naniSchema);