const mongoose = require('mongoose')

const Schema = mongoose.Schema

const sizeSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
})

module.exports = mongoose.model('Size', sizeSchema)