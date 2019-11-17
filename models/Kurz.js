const mongoose = require('mongoose');

const ParentSchema = new mongoose.Schema({
    parentFirstName: {
        type: String,
        required: true
    },
    parentLastName: {
        type: String,
        required: true
    },
    parentEmail: {
        type: String,
        required: true
    },
    parentPhoneNum: {
        type: String,
    },
    parentInf: {
        type: String
    },
});

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNum: {
        type: String
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true
    },
    PSC: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    inf: {
        type: String
    },
    parent: [ParentSchema],
    payed: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const KurzSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    users: [UserSchema],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Kurz', KurzSchema);