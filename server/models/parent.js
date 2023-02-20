const mongoose = require('mongoose');
const historyRateSchema = require('../models/history_rate');


const parentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    child_name: {
        type: String,
        required: true
    },
    child_gender: {
        type: String,
        required: true
    },
    child_age: {
        type: Number,
        required: true
    },
    residence: {
        type: String,
        required: true
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

// parentSchema.add({
//     history:{
//         type: [historyRateSchema],
//         require: true,
//         default: []
//     }
// })

module.exports = mongoose.model('Parent', parentSchema);