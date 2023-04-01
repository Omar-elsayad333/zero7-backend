const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const { db } = require('../config/db')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        name: {
            type: String,
            required: true
        },
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    }
})

// static signup method
userSchema.statics.signup = async function(name, email, password) {

    // validation
    if (!name || !email || !password) {
        throw Error('All fields must be filled')
    }
    if (!validator.isEmail(email)) {
        throw Error('Email not valid')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
    }

    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const roleId = await db.model('Role').findOne({name: 'admin'})

    if(!roleId) {
        throw Error('someThing went wrong')
    }

    const user = await this.create(
        {
            name,
            email,
            password: hash,
            role: {
                name: 'admin',
                roleId: roleId
            } 
        }
    )

    return user
}

// static login method
userSchema.statics.login = async function(email, password) {

    if(!email || !password) {
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({ email })
    if(!user) {
        throw Error('Incorrect email')
    }

    const match = await bcrypt.compare(password, user.password)
    if(!match) {
        throw Error('Incorrect password')
    }

    return user
}

module.exports = mongoose.model('User', userSchema)