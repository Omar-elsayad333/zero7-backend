const express = require('express')
const { memoryUpload } = require('../config/multer')
const userMiddleware = require('../middlewares/userMiddleware')
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
router.post('/socialRegister', socialRegister)

// Login route
router.post('/login', loginUser)

// Signup route
router.post('/signup', signupUser)

// User data route
router.get('/userData', authMiddleware, userData)

// Update user data route
router.patch(
  '/updateUser',
  authMiddleware,
  userMiddleware,
  memoryUpload.single('avatar'),
  updateUser,
)

// Refresh token
router.post('/refreshToken', refreshToken)

// Reset password route
router.patch('/resetPassword', resetPassword)

// Get all users
router.get('/', authMiddleware, requiredRoles(['superAdmin']), getAllUsers)

// Delete user
router.delete('/', authMiddleware, requiredRoles(['superAdmin']), deleteUser)

module.exports = router
