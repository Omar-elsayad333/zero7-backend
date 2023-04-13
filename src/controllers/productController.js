const mongoose = require('mongoose')
const { db } = require('../config/db')
const Product = require('../models/productModels')

// get all products
const getProducts = async (req, res) => {
    const products = await Product.find().sort({createdAt: -1})
    res.status(200).json(products)
}

// get a single product
const getProduct = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such product'})
    }

    const product = await db.model('Product').findById(id)
    .populate({
        path: 'colors.colorId',
        select: 'name hexColor'
    })
    .populate({
        path: 'colors.sizes.sizeId',
        select: 'name'
    })

    if (!product) {
        return res.status(404).json({error: 'No such product'})
    }

    res.status(200).json(product)
}

// create new product
const createProduct = async (req, res) => {
    const emptyFields = []
    const { name, description, price, categoryId, seasonId, genderId, colors } = req.body

    if(!name) {
        emptyFields.push('name')
    }
    if(!description) {
        emptyFields.push('description')
    }
    if(!price) {
        emptyFields.push('price')
    }
    if(!categoryId) {
        emptyFields.push('categoryId')
    }
    if(!seasonId) {
        emptyFields.push('seasonId')
    }
    if(!genderId) {
        emptyFields.push('genderId')
    }
    if(!colors.length) {
        emptyFields.push('colors')
    }
    if(emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
    }

    if(! await db.model('Category').findOne({ _id: categoryId })) {
        return res.status(404).json({ error: 'No such category'})
    }
    if(! await db.model('Season').findOne({ _id: seasonId })) {
        return res.status(404).json({ error: 'No such season'})
    }
    if(! await db.model('Gender').findOne({ _id: genderId })) {
        return res.status(404).json({ error: 'No such gender'})
    }
    for(let color of colors) {
        if(! await db.model('Color').findOne({ _id: color.colorId})) {
            return res.status(404).json({ error: 'No such color'})
        }
        
        for(let size of color.sizes) {
            if(! await db.model('Size').findOne({ _id: size.sizeId})) {
                return res.status(404).json({ error: 'No such size'})
            }
            if(!size.quantity) {
                return res.status(400).json({ error: 'Please fill in all the fields [quantity]' })
            }
        }
    }

    // add doc to db
    try {
        const product = await Product.create({...req.body})
        res.status(200).json(product)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// delete a product
const deleteProduct = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    const workout = await Product.findOneAndDelete({_id: id})

    if (!workout) {
        return res.status(400).json({error: 'No such workout'})
    }

    res.status(200).json(workout)
}

// update a product
const updateProduct = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    const workout = await Product.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!workout) {
        return res.status(400).json({error: 'No such workout'})
    }

    res.status(200).json(workout)
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct
}