const mongoose = require('mongoose')

const Schema = mongoose.Schema

const seasonSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
})

module.exports = mongoose.model('Season', seasonSchema)