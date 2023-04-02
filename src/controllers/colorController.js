const mongoose = require('mongoose')
const validator = require('validator')
const Color = require('../models/colorModels')

// Get all colors
const getColors = async (req, res) => {
    const colors = await Color.find().sort({createdAt: -1})
    res.status(200).json(colors)
}

// Get a single color
const getColor = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such color'})
    }

    const color = await Color.findById(id)

    if (!color) {
        return res.status(404).json({error: 'No such color'})
    }
    
    res.status(200).json(color)
}

// Create new color
const createColor = async (req, res) => {
    const { name, hexColor } = req.body

    const emptyFields = []

    if(!name) {
        emptyFields.push('name')
    }
    if(!hexColor) {
        emptyFields.push('hex color')
    }else {
        if(!validator.isHexColor(hexColor)) {
            emptyFields.push('hex code')
        }
    }

    // send error if there is any empty fields
    if(emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the required fields', emptyFields })
    }

    if(await Color.findOne({name})) {
        return res.status(400).json({ error: 'This color name is already exist'})
    }

    if(await Color.findOne({hexColor})) {
        return res.status(400).json({ error: 'This color hex color is already exist'})
    }

    // add doc to db
    try {
        const color = await Color.create({ name, hexColor })
        res.status(200).json(color)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Delete a color
const deleteColor = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such color'})
    }

    const color = await Color.findOneAndDelete({_id: id})

    if (!color) {
        return res.status(400).json({error: 'No such color'})
    }

    res.status(200).json(color)
}

// Update a color
const updateColor = async (req, res) => {
    const { id } = req.params
    const { name, hexColor } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such colors'})
    }

    if(name && await Color.findOne({name})) {
        return res.status(400).json({error: 'This color name is already exist'})
    }  

    if(hexColor && await Color.findOne({hexColor})) {
        return res.status(400).json({error: 'This hex color is already exist'})
    }  
 
    const color = await Color.findOneAndUpdate({_id: id}, {...req.body})

    if (!color) {
        return res.status(400).json({error: 'No such color'})
    }

    res.status(200).json(color)
}

module.exports = {
    getColor,
    getColors,
    createColor,
    deleteColor,
    updateColor
}