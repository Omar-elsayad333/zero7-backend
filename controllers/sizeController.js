const mongoose = require('mongoose')
const Size = require('../models/sizeModels')

// Get all sizes
const getSizes = async (req, res) => {
    const sizes = await Size.find().sort({createdAt: -1})
    res.status(200).json(sizes)
}

// Get a single size
const getSize = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such size'})
    }

    const size = await Size.findById(id)

    if (!size) {
        return res.status(404).json({error: 'No such size'})
    }
    
    res.status(200).json(size)
}

// Create new size
const createSize = async (req, res) => {
    const { name } = req.body

    const emptyFields = []

    if(!name) {
        emptyFields.push('name')
    }

    // send error if there is any empty fields
    if(emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the required fields', emptyFields })
    }

    if(await Size.findOne({ name })) {
        return res.status(400).json({ error: 'This size is already exist'})
    }

    // add doc to db
    try {
        const size = await Size.create({ name })
        res.status(200).json(size)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Delete a size
const deleteSize = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such size'})
    }

    const size = await Size.findOneAndDelete({_id: id})

    if (!size) {
        return res.status(400).json({error: 'No such size'})
    }

    res.status(200).json(size)
}

// Update a size
const updateSize = async (req, res) => {
    const { id } = req.params
    const { name } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such size'})
    }

    if(name && await Size.findOne({ name })) {
        return res.status(400).json({error: 'This size is already exist'})
    }

    const size = await Size.findOneAndUpdate({_id: id}, {...req.body})

    if (!size) {
        return res.status(400).json({error: 'No such size'})
    }

    res.status(200).json(size)
}

module.exports = {
    getSize,
    getSizes,
    createSize,
    deleteSize,
    updateSize
}