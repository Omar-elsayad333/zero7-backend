const express = require('express')
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
  testImage,
} = require('../controllers/userController')

// Initi express router
const router = express.Router()

router.post('/image', testImage)

// OAuth route
router.post('/OAuth', OAuthUser)

// Login route
router.post('/login', loginUser)

// Signup route
router.post('/signup', signupUser)

// User data route
router.get('/userData', userData)

// User data route
router.patch('/updateUser', updateUser)

// Refresh token
router.post('/refreshToken', refreshToken)

// Reset password route
router.patch('/resetPassword', resetPassword)

// Get all users
router.get('/', requiredRoles(['superAdmin']), getAllUsers)

// Delete user
router.delete('/', requiredRoles(['superAdmin']), deleteUser)

module.exports = router
