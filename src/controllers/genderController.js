const mongoose = require('mongoose')
const Gender = require('../models/genderModels')

// Get all genders
const getGenders = async (req, res) => {
    const genders = await Gender.find().sort({createdAt: -1})
    res.status(200).json(genders)
}

// Get a single gender
const getGender = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such gender'})
    }

    const gender = await Gender.findById(id)

    if (!gender) {
        return res.status(404).json({error: 'No such gender'})
    }
    
    res.status(200).json(gender)
}

// Create new gender
const createGender = async (req, res) => {
    const { name } = req.body

    const emptyFields = []

    if(!name) {
        emptyFields.push('name')
    }

    // send error if there is any empty fields
    if(emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the required fields', emptyFields })
    }

    if(await Gender.findOne({name})) {
        return res.status(400).json({ error: 'This name is already exist'})
    }

    // add doc to db
    try {
        const gender = await Gender.create({ name })
        res.status(200).json(gender)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Delete a gender
const deleteGender = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such gender'})
    }

    const gender = await Gender.findOneAndDelete({_id: id})

    if (!gender) {
        return res.status(400).json({error: 'No such gender'})
    }

    res.status(200).json(gender)
}

// Update a gender
const updateGender = async (req, res) => {
    const { id } = req.params
    const { name } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such gender'})
    }

    if(name && await Gender.findOne({ name })) {
        return res.status(400).json({error: 'This gender is already exist'})
    }

    const gender = await Gender.findOneAndUpdate({_id: id}, {...req.body})

    if (!gender) {
        return res.status(400).json({error: 'No such gender'})
    }

    res.status(200).json(gender)
}

module.exports = {
    getGender,
    getGenders,
    createGender,
    deleteGender,
    updateGender
}