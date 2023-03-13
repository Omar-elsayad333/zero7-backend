const mongoose = require('mongoose')

const Schema = mongoose.Schema

const genderSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
})

module.exports = mongoose.model('Gender', genderSchema)