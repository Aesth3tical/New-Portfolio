const mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    _id: { type: String, required: true },
    cooldowns: { type: Array, required: true, default: [] },
    logs: { type: Array, required: true, default: [] },
})