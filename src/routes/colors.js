const express = require('express')
const requiredRoles = require('../middlewares/requiredRoles')

// Controllers
const {
    getColor,
    getColors,
    createColor,
    deleteColor,
    updateColor
} = require('../controllers/colorController')

// Initi express router
const router = express.Router()

// GET all colors
router.get('/', getColors)

//GET a single color
router.get('/:id', getColor)

// POST a new color
router.post('/', requiredRoles(['superAdmin', 'admin', 'manager']), createColor)

// DELETE a color
router.delete('/:id', requiredRoles(['superAdmin', 'admin', 'manager']), deleteColor)

// UPDATE a color
router.patch('/:id', requiredRoles(['superAdmin', 'admin', 'manager']), updateColor)

module.exports = router