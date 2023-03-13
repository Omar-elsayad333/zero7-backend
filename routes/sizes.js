const express = require('express')
const requiredRoles = require('../middlewares/requiredRoles')

// Controllers
const {
    getSize,
    getSizes,
    createSize,
    deleteSize,
    updateSize
} = require('../controllers/sizeController')

// Initi express router
const router = express.Router()

// GET all sizes
router.get('/', getSizes)  

//GET a single size
router.get('/:id', getSize)

// POST a new size
router.post('/', requiredRoles(['superAdmin', 'admin', 'manager']), createSize)

// DELETE a size
router.delete('/:id', requiredRoles(['superAdmin', 'admin', 'manager']), deleteSize)

// UPDATE a size
router.patch('/:id', requiredRoles(['superAdmin', 'admin', 'manager']), updateSize)

module.exports = router