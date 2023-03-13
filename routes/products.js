const express = require('express')
const requiredRoles = require('../middlewares/requiredRoles')

// Controllers
const {
    getProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct
} = require('../controllers/productController')

// Initi express router
const router = express.Router()

// GET all workouts
router.get('/', getProducts)

//GET a single workout
router.get('/:id', getProduct)

// POST a new product
router.post('/', requiredRoles(['superAdmin', 'admin', 'manager']), createProduct)

// DELETE a product
router.delete('/:id', requiredRoles(['superAdmin', 'admin', 'manager']), deleteProduct)

// UPDATE a product
router.patch('/:id', requiredRoles(['superAdmin', 'admin', 'manager']), updateProduct)

module.exports = router