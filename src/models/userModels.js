const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const { db } = require('../config/db')
const validator = require('validator')

const Schema = mongoose.Schema
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  media: {
    type: Array,
  },
  phoneNumber: {
    type: String,
    unique: true,
  },
  country: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    unique: true,
  },
  refreshToken: {
    type: String,
    unique: true,
  },
  socialToken: {
    type: String,
    unique: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  role: {
    name: {
      type: String,
      // required: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
    },
  },
})

// static signup method
userSchema.statics.signup = async function (body) {
  const { firstName, lastName, phoneNumber, email, password, confirmPassword, socialToken } = body

  if (!firstName || !lastName || !email) {
    throw Error('All fields must be filled')
  }

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match')
  }
  if (!socialToken && !password) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid')
  }
  if (password && !validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }
  const encodedPhoneNumber = phoneNumber?.replace('%2B', '+')
  if (encodedPhoneNumber) {
    if (!validator.isMobilePhone(encodedPhoneNumber, ['ar-EG'])) {
      throw Error('Phone number not valid')
    }
  }

  const emailExists = await this.findOne({ email })
  if (emailExists) {
    throw Error('Email already in use')
  }

  const phoneNumberExists = await this.findOne({ phoneNumber })
  if (phoneNumber) {
    if (phoneNumberExists) {
      throw Error('Phone number already in use')
    }
  }

  let hash
  if (password) {
    const salt = await bcrypt.genSalt(10)
    hash = await bcrypt.hash(password, salt)
  }

  const roleId = await db.model('Role').findOne({ name: 'admin' })

  if (!roleId) {
    throw Error('someThing went wrong')
  }

  const userData = {
    firstName,
    lastName,
    email,
    role: {
      name: 'admin',
      roleId: roleId,
    },
  }

  if (!socialToken) userData.password = hash
  if (phoneNumber) userData.phoneNumber = phoneNumber
  if (socialToken) userData.socialToken = socialToken
  console.log(userData)
  const user = await this.create({ ...userData })

  return user
}

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  let user = await this.findOne({ email })
  if (!user) {
    const userWithPhone = await this.findOne({ phoneNumber: email })
    if (!userWithPhone) {
      throw Error('Incorrect email or phone number')
    } else {
      user = userWithPhone
    }
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('Incorrect password')
  }

  return user
}

// static social login method
userSchema.statics.socialLogin = async function (email, socialToken) {
  let user = await this.findOne({ email })

  if (!user) {
    throw Error('Failed to register user')
  }

  if (user.socialToken !== socialToken) {
    throw Error('Failed to register user')
  }

  return user
}

module.exports = mongoose.model('User', userSchema)
