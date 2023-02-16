const mongoose = require('mongoose');

const naniSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
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
    },
    rating: {
        type: Number,
    }
});
module.exports = mongoose.model('Nani', naniSchema);