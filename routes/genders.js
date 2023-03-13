const express = require('express')
const requiredRoles = require('../middlewares/requiredRoles')

// Controllers
const {
    getGender,
    getGenders,
    createGender,
    deleteGender,
    updateGender
} = require('../controllers/genderController')

// Initi express router
const router = express.Router()

// GET all genders
router.get('/', getGenders)  

//GET a single gender
router.get('/:id', getGender)

// POST a new gender
router.post('/', requiredRoles(['superAdmin', 'admin', 'manager']), createGender)

// DELETE a gender
router.delete('/:id', requiredRoles(['superAdmin', 'admin', 'manager']), deleteGender)

// UPDATE a gender
router.patch('/:id', requiredRoles(['superAdmin', 'admin', 'manager']), updateGender)

module.exports = router