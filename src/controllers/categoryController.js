const mongoose = require('mongoose')
const Category = require('../models/categoryModels')

// Get all category
const getCategorys = async (req, res) => {
    const categorys = await Category.find().sort({createdAt: -1})
    res.status(200).json(categorys)
}

// Get a single category
const getCategory = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such category'})
    }

    const category = await Category.findById(id)

    if (!category) {
        return res.status(404).json({error: 'No such category'})
    }
    
    res.status(200).json(category)
}

// Create new category
const createCategory = async (req, res) => {
    const { name } = req.body

    const emptyFields = []

    if(!name) {
        emptyFields.push('name')
    }

    // send error if there is any empty fields
    if(emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the required fields', emptyFields })
    }

    if(await Category.findOne({ name })) {
        return res.status(400).json({ error: 'This category is already exist'})
    }

    // add doc to db
    try {
        const category = await Category.create({ name })
        res.status(200).json(category)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Delete a category
const deleteCategory = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such category'})
    }

    const category = await Category.findOneAndDelete({_id: id})

    if (!category) {
        return res.status(400).json({error: 'No such category'})
    }

    res.status(200).json(category)
}

// Update a category
const updateCategory = async (req, res) => {
    const { id } = req.params
    const { name } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such category'})
    }

    if(name && await Category.findOne({ name })) {
        return res.status(400).json({error: 'This category is already exist'})
    }

    const category = await Category.findOneAndUpdate({_id: id}, {...req.body})

    if (!category) {
        return res.status(400).json({error: 'No such category'})
    }

    res.status(200).json(category)
}

module.exports = {
    getCategory,
    getCategorys,
    createCategory,
    deleteCategory,
    updateCategory
}