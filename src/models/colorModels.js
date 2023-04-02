const mongoose = require('mongoose')

const Schema = mongoose.Schema

const colorSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    hexColor: {
        type: String,
        unique: true,   
        required: true
    }
})

module.exports = mongoose.model('Color', colorSchema)