const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).json({ status: 401, message: 'Not authanticted' })
  }

  // Verify req token
  const token = authorization.split(' ')[1]

  try {
    // const { _id } = jwt.verify(token, process.env.SECRET)
    // if (!_id) {
    //   throw new Error('No Id')
    // }

    req.token = token
    next()
  } catch (error) {
    console.log(error)
    return res.status(401).json({ error: 'Request is not authorized' })
  }
}

module.exports = authMiddleware
