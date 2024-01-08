const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const { db } = require('../config/db')
const User = require('../models/userModels')
const usersServices = require('../services/usersServices')
const {
  createAccesToken,
  createRefreshToken,
  getTokenExpDate,
  checkRefreshTokenExp,
} = require('../helpers/token')

// Login a user
const loginUser = async (req, res) => {
  try {
    const user = await usersServices.loginUser(req.body)
    res.status(200).json({ status: 200, message: 'Login successfully', data: user })
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message })
  }
}

// Signup a user
const signupUser = async (req, res) => {
  try {
    const user = await usersServices.signupUser(req.body)
    res.status(200).json({ status: 200, message: 'Sign up user successfully', data: user })
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message })
  }
}

// OAuth a user
const socialRegister = async (req, res) => {
  try {
    const user = await usersServices.socialRegister(req.body)

    // Create new tokens for user
    user.accessToken = await createAccesToken(user._id)
    user.refreshToken = await createRefreshToken(user._id)
    const accessTokenExpireAt = await getTokenExpDate(user.accessToken)
    const refreshTokenExpireAt = await getTokenExpDate(user.refreshToken)

    // Save the new tokens to the user
    await user.save()

    res.status(200).json({
      email: user.email,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      accessTokenExpireAt,
      refreshTokenExpireAt,
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Get user data
const userData = async (req, res) => {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ message: 'Not authanticted' })
  }

  const token = authorization.split(' ')[1]

  const user = await db.model('User').findOne(
    { accessToken: token },
    {
      _id: 0,
      __v: 0,
      password: 0,
      accessToken: 0,
      refreshToken: 0,
      role: {
        roleId: 0,
      },
    },
  )
  if (!user) {
    return res.status(404).json({ message: 'No such user' })
  }

  try {
    return res.status(200).json(user)
  } catch (error) {
    return res.status(404).json({ message: error.message })
  }
}

// Update user data
const updateUser = async (req, res) => {
  try {
    console.log(req.body)
    const user = await usersServices.updateUser(req.token, req.body, req.file)
    res.status(200).json({ status: 200, messeage: 'User Updated Successfully', data: user })
  } catch (error) {
    res.status(400).json({ status: 400, message: error })
  }
}

// Create new token
const refreshToken = async (req, res) => {
  const accessToken = req.body.accessToken
  const refreshToken = req.body.refreshToken

  if (!accessToken) {
    return res.status(401).json({ message: 'Access token is required.' })
  }
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required.' })
  }

  const user = await db.model('User').findOne({ accessToken })
  if (!user) {
    return res.status(401).json({ messeage: 'There is no such user' })
  }

  try {
    await checkRefreshTokenExp(refreshToken)
    const newAccessToken = await createAccesToken(user._id)
    const newRefreshToken = await createRefreshToken(user._id)
    const accessTokenExpireAt = await getTokenExpDate(user.accessToken)
    const refreshTokenExpireAt = await getTokenExpDate(user.refreshToken)

    // update user tokens
    await db.model('User').findOneAndUpdate(
      { _id: user._id },
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenExpireAt,
        refreshTokenExpireAt,
      },
    )

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpireAt,
      refreshTokenExpireAt,
    })
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

// Get all users
const getAllUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 })

  if (!users.length) {
    return res.status(404).json('No such users')
  }

  res.status(200).json(users)
}

// Delete a user
const deleteUser = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(404).json('No such user with this email')
  }

  const user = await User.findOneAndDelete({ email: email })

  if (!user) {
    return res.status(400).json('No such user')
  }

  res.status(200).json(user)
}

// Reset password
const resetPassword = async (req, res) => {
  const { authorization } = req.headers
  const { oldPassword, newPassword } = req.body

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' })
  }

  if (!oldPassword || !newPassword) {
    return res.status(400).json('All fields must be filled')
  }

  if (!validator.isStrongPassword(newPassword)) {
    return res.status(400).json('New password not strong enough')
  }

  if (oldPassword === newPassword) {
    return res.status(400).json('You must enter a new password')
  }

  const token = authorization.split(' ')[1]

  const { _id } = jwt.verify(token, process.env.SECRET)
  const user = await User.findOne({ _id: _id })

  const match = await bcrypt.compare(oldPassword, user.password)
  if (!match) {
    return res.status(404).json('Old password is not correct')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword, salt)

  const updatedUser = await User.findOneAndUpdate({ _id: _id }, { password: hashedPassword })

  if (!updatedUser) {
    return res.status(500).json('Some thing went wrong')
  }

  return res.status(200).json(updatedUser)
}

module.exports = {
  socialRegister,
  loginUser,
  signupUser,
  userData,
  updateUser,
  refreshToken,
  getAllUsers,
  deleteUser,
  resetPassword,
}
