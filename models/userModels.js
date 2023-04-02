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
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
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
userSchema.statics.signup = async function(name, phoneNumber, email, password) {

    // validation
    if (!name || !phoneNumber || !email || !password) {
        throw Error('All fields must be filled')
    }
    if (!validator.isEmail(email)) {
        throw Error('Email not valid')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
    }
    if (!validator.isMobilePhone(phoneNumber, ['ar-EG'])) {
        throw Error('phone number not valid')
    }   

    const emailExists = await this.findOne({ email })
    const phoneNumberExists = await this.findOne({ phoneNumber })

    if (emailExists) {
        throw Error('Email already in use')
    }

    if (phoneNumberExists) {
        throw Error('Phone number already in use')
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
            phoneNumber,
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

    let user = await this.findOne({ email })
    if(!user) {
        const userWithPhone = await this.findOne({ phoneNumber: email })
        if(!userWithPhone) {
            throw Error('Incorrect email or phone number')
        }else {
            user = userWithPhone
        }
    }

    const match = await bcrypt.compare(password, user.password)
    if(!match) {
        throw Error('Incorrect password')
    }

    return user
}

module.exports = mongoose.model('User', userSchema)