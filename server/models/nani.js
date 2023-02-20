const mongoose = require('mongoose');
const historyRateSchema = require('../models/history_rate');


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
    },
    history:{
        type: [historyRateSchema],
        require: true,
        default: []
    }
});

module.exports = mongoose.model('Nani', naniSchema);
// naniSchema.add({
//     history:{
//         type: [historyRateSchema],
//         require: true,
//         default: []
//     }
// })