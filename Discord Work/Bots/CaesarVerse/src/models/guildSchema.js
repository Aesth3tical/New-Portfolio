const { model } = require("mongoose");

module.exports = model('Guild', {
    _id: { type: String, required: true }
})