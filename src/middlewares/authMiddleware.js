const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ status: 401, message: 'Not authanticted' })
  }

  req.token = authorization.split(' ')[1]
  next()
}

module.exports = authMiddleware
