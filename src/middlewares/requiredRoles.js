const jwt = require('jsonwebtoken')
const { db } = require('../config/db')

const requiredRoles = (roles) => {
  return async function (req, res, next) {
    const { authorization } = req.headers

    if (!authorization) {
      return res.status(401).json({ error: 'Authorization token required' })
    }

    const token = authorization.split(' ')[1]

    const { _id } = jwt.verify(token, process.env.SECRET)

    if (!_id) {
      return res.status(401).json({ error: 'Request is not authorized' })
    }

    const userRole = await db.model('User').findOne({ _id }).select('role')

    // Check if the user has the required role
    if (!userRole.role || !roles.find((role) => role === userRole.role.name)) {
      return res.status(401).json('Not authorizeds')
    }

    const roleCheck = await db.model('Role').findOne({ _id: userRole.role.roleId })

    if (!roleCheck) {
      return res.status(401).json('Not authorizedz')
    }

    next()
  }
}

module.exports = requiredRoles
