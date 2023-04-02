const express = require('express')
const requiredRoles = require('../middlewares/requiredRoles')

// Controllers
const { 
    loginUser, 
    signupUser,
    userData,
    refreshToken,
    getAllUsers,
    deleteUser,
    resetPassword
} = require('../controllers/userController')

// Initi express router
const router = express.Router()

// Login route
router.post('/login', loginUser)

// Signup route
router.post('/signup', signupUser)

// User data route
router.get('/userData', requiredRoles(['superAdmin', 'admin', 'manager', 'employee']), userData)

// Refresh token
router.post('/refreshToken', refreshToken)

// Reset password route
router.patch('/resetPassword', requiredRoles(['superAdmin', 'admin', 'manager', 'employee']), resetPassword)

// Get all users
router.get('/', requiredRoles(['superAdmin']), getAllUsers)

// Delete user
router.delete('/', requiredRoles(['superAdmin']), deleteUser)


module.exports = router