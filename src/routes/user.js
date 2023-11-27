const express = require('express')
const { upload } = require('../config/multer')
const requiredRoles = require('../middlewares/requiredRoles')

// Controllers
const {
  OAuthUser,
  loginUser,
  signupUser,
  userData,
  updateUser,
  refreshToken,
  getAllUsers,
  deleteUser,
  resetPassword,
} = require('../controllers/user.controller')

// Initi express router
const router = express.Router()

// OAuth route
router.post('/OAuth', OAuthUser)

// Login route
router.post('/login', loginUser)

// Signup route
router.post('/signup', signupUser)

// User data route
router.get('/userData', userData)

// User data route
router.patch('/updateUser', upload.single('profileImage'), updateUser)

// Refresh token
router.post('/refreshToken', refreshToken)

// Reset password route
router.patch('/resetPassword', resetPassword)

// Get all users
router.get('/', requiredRoles(['superAdmin']), getAllUsers)

// Delete user
router.delete('/', requiredRoles(['superAdmin']), deleteUser)

module.exports = router
