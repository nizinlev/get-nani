const mongoose = require('mongoose');

const historyRateSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    by_who: {
        type: String,
        required: true
    },
    rated_id: {
        type: String,
        required: true
    },
    sum_rating: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: true
    }
});
// const HistoryRate=  mongoose.model('HistoryRate', historyRateSchema);

module.exports = historyRateSchema;