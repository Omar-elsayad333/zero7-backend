const mongoose = require('mongoose')
const Role = require('../models/roleModels')

// Get all roles
const getRoles = async (req, res) => {
    const roles = await Role.find().sort({createdAt: -1})
    res.status(200).json(roles)
}

// Get a single role
const getRole = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such role'})
    }

    const role = await Role.findById(id)

    if (!role) {
        return res.status(404).json({error: 'No such role'})
    }
    
    res.status(200).json(role)
}

// Create new role
const createRole = async (req, res) => {
    const { name } = req.body

    const emptyFields = []

    if(!name) {
        emptyFields.push('name')
    }

    // send error if there is any empty fields
    if(emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the required fields', emptyFields })
    }

    if(await Role.findOne({name})) {
        return res.status(400).json({ error: 'This role is already exist'})
    }

    // add doc to db
    try {
        const role = await Role.create({ name })
        res.status(200).json(role)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Delete a role
const deleteRole = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such role'})
    }

    const role = await Role.findOneAndDelete({_id: id})

    if (!role) {
        return res.status(400).json({error: 'No such role'})
    }

    res.status(200).json(role)
}

// Update a role
const updateRole = async (req, res) => {
    const { id } = req.params
    const { name } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such role'})
    }

    if(name && await Role.findOne({ name })) {
        return res.status(400).json({error: 'This role is already exist'})
    }

    const role = await Role.findOneAndUpdate({_id: id}, {...req.body})

    if (!role) {
        return res.status(400).json({error: 'No such role'})
    }

    res.status(200).json(role)
}

module.exports = {
    getRole,
    getRoles,
    createRole,
    deleteRole,
    updateRole
}