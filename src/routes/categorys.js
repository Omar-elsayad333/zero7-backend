const express = require('express')
const requiredRoles = require('../middlewares/requiredRoles')

// Controllers
const {
    getCategory,
    getCategorys,
    createCategory,
    deleteCategory,
    updateCategory
} = require('../controllers/categoryController')

// Initi express router
const router = express.Router()

// GET all categorys
router.get('/', getCategorys)  

//GET a single category
router.get('/:id', getCategory)

// POST a new category
router.post('/', requiredRoles(['superAdmin', 'admin', 'manager']), createCategory)

// DELETE a category
router.delete('/:id', requiredRoles(['superAdmin', 'admin', 'manager']), deleteCategory)

// UPDATE a category
router.patch('/:id', requiredRoles(['superAdmin', 'admin', 'manager']), updateCategory)

module.exports = router