const express = require('express')
// const { upload } = require('../config/multer')
const requiredRoles = require('../middlewares/requiredRoles')
const authMiddleware = require('../middlewares/authMiddleware')

// Controllers
const {
  socialRegister,
  loginUser,
  signupUser,
  userData,
  updateUser,
  refreshToken,
  getAllUsers,
  deleteUser,
  resetPassword,
} = require('../controllers/userController')

// Initi express router
const router = express.Router()

// OAuth route
router.post('/socialRegester', socialRegister)

// Login route
router.post('/login', loginUser)

// Signup route
router.post('/signup', signupUser)

// User data route
router.get('/userData', authMiddleware, userData)

// User data route
router.patch('/updateUser', authMiddleware, updateUser)

// Refresh token
router.post('/refreshToken', authMiddleware, refreshToken)

// Reset password route
router.patch('/resetPassword', resetPassword)

// Get all users
router.get('/', requiredRoles(['superAdmin']), getAllUsers)

// Delete user
router.delete('/', requiredRoles(['superAdmin']), deleteUser)

module.exports = router
