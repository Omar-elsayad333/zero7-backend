const mongoose = require('mongoose')
const Season = require('../models/seasonModels')

// Get all seasons
const getSeasons = async (req, res) => {
  const seasons = await Season.find().sort({ createdAt: -1 })
  res.status(200).json(seasons)
}

// Get a single season
const getSeason = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such season' })
  }

  const season = await Season.findById(id)

  if (!season) {
    return res.status(404).json({ error: 'No such season' })
  }

  res.status(200).json(season)
}

// Create new season
const createSeason = async (req, res) => {
  const { name } = req.body

  const emptyFields = []

  if (!name) {
    emptyFields.push('name')
  }

  // send error if there is any empty fields
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the required fields', emptyFields })
  }

  if (await Season.findOne({ name })) {
    return res.status(400).json({ error: 'This season is already exist' })
  }

  // add doc to db
  try {
    const season = await Season.create({ name })
    res.status(200).json(season)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Delete a season
const deleteSeason = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such season' })
  }

  const season = await Season.findOneAndDelete({ _id: id })

  if (!season) {
    return res.status(400).json({ error: 'No such season' })
  }

  res.status(200).json(season)
}

// Update a season
const updateSeason = async (req, res) => {
  const { id } = req.params
  const { name } = req.body

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such season' })
  }

  if (name && (await Season.findOne({ name }))) {
    return res.status(400).json({ error: 'This season is already exist' })
  }

  const season = await Season.findOneAndUpdate({ _id: id }, { ...req.body })

  if (!season) {
    return res.status(400).json({ error: 'No such season' })
  }

  res.status(200).json(season)
}

module.exports = {
  getSeason,
  getSeasons,
  createSeason,
  deleteSeason,
  updateSeason,
}
