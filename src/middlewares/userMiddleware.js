const { db } = require('../config/db')

const userMiddleware = async (req, res, next) => {
  const userToken = req.token

  console.log(userToken)

  if (!userToken) {
    return res.status(401).json({ error: 'User is not authorized' })
  }

  // Get user data
  const userData = await db.model('User').findOne({ accessToken: userToken })
  if (!userData) {
    return res.status(401).json({ error: 'User is not authorized' })
  }

  req.userData = userData
  next()
}

module.exports = userMiddleware
