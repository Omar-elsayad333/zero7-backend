const express = require('express')
const requiredRoles = require('../middlewares/requiredRoles')

// Controllers
const {
    getRole,
    getRoles,
    createRole,
    deleteRole,
    updateRole
} = require('../controllers/roleController')

// Initi express router
const router = express.Router()

// GET all roles
router.get('/', getRoles)  

//GET a single role 
router.get('/:id', getRole)

// POST a new role
router.post('/', requiredRoles(['superAdmin', 'admin', 'manager']), createRole)

// DELETE a role
router.delete('/:id', requiredRoles(['superAdmin', 'admin', 'manager']), deleteRole)

// UPDATE a role
router.patch('/:id', requiredRoles(['superAdmin', 'admin', 'manager']), updateRole)

module.exports = router