const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const User = require('../models/userModels')
const { createToken } = require('../helpers/token')

// Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.login(email, password)

        // create a token
        const token = createToken(user._id)

        // get the user email
        const userEmail = user.email

        res.status(200).json({email:userEmail, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }

    // check if user is valid
    // const username = req.body.username;
    // const user = { username: username };
    // const accessToken = generateAccessToken(user);
    // const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    // refreshTokens.push(refreshToken);
    // res.json({ accessToken: accessToken, refreshToken: refreshToken });
}

// Signup a user
const signupUser = async (req, res) => {
    const { name, phoneNumber, email, password, confirmPassword } = req.body

    if(password !== confirmPassword) {
        return res.status(400).json('Passwords do not match')
    }

    if(phoneNumber.slice(0,3) !== '+20') {
        return res.status(400).json('Phone number not valid')
    }

    try {
        const user = await User.signup(name, phoneNumber, email, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Create new token
const refreshToken = async (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token is required." })
    }

    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json({ message: "Invalid refresh token." })
    }

    const { _id } = jwt.verify(token, process.env.SECRET)
    if (!err) {
        return res.status(403).json({ message: "Invalid refresh token." })
    }

    const accessToken = createToken({ _id });

    res.json({ accessToken: accessToken });
}

// Get all users
const getAllUsers = async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 })

    if(!users.length) {
        return res.status(404).json('No such users')
    }
    
    res.status(200).json(users)
}

// Delete a user
const deleteUser = async (req, res) => {
    const { email } = req.body

    if(!email) {
        return res.status(404).json('No such user with this email')
    }

    const user = await User.findOneAndDelete({ email: email })   

    if(!user) {
        return res.status(400).json('No such user')
    }

    res.status(200).json(user)
}

// Reset password
const resetPassword = async (req, res) => {
    const { authorization } = req.headers
    const { oldPassword, newPassword } = req.body

    if (!authorization) {
        return res.status(401).json({error: 'Authorization token required'})
    }

    if(!oldPassword || !newPassword) {
        return res.status(400).json('All fields must be filled')
    }

    if (!validator.isStrongPassword(newPassword)) {
        return res.status(400).json('New password not strong enough')
    }

    if(oldPassword === newPassword) {
        return res.status(400).json('You must enter a new password')
    }

    const token = authorization.split(' ')[1]

    const { _id } = jwt.verify(token, process.env.SECRET)
    const user = await User.findOne({ _id: _id })

    const match = await bcrypt.compare(oldPassword, user.password)
    if(!match) {
        return res.status(400).json('Old password is not correct')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    
    const updatedUser = await User.findOneAndUpdate({ _id: _id }, { password: hashedPassword })
    
    if(!updatedUser) {
        return res.status(404).json('Old password is not correct')    
    }

    return res.status(200).json(updatedUser)    
}

module.exports = { 
    signupUser,
    loginUser,
    refreshToken,
    getAllUsers,
    deleteUser,
    resetPassword
}