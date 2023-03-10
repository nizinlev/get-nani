const mongoose = require('mongoose');

const offerListSchema = new mongoose.Schema({
  time_start: {
    type: Date,
    required: true
  },
  time_finish: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  payment: {
    type: Number,
    required: true
  },
  id: {
    type: String,
    required: true,
},
});

const OfferList = mongoose.model('OfferList', offerListSchema);

module.exports = OfferList;