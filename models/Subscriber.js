const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 50
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);