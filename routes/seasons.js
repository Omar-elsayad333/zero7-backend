const express = require('express')
const requiredRoles = require('../middlewares/requiredRoles')

// Controllers
const {
    getSeason,
    getSeasons,
    createSeason,
    deleteSeason,
    updateSeason
} = require('../controllers/seasonController')

// Initi express router
const router = express.Router()

// GET all seasons
router.get('/', getSeasons)  

//GET a single season
router.get('/:id', getSeason)

// POST a new season
router.post('/', requiredRoles(['superAdmin', 'admin', 'manager']), createSeason)

// DELETE a season
router.delete('/:id', requiredRoles(['superAdmin', 'admin', 'manager']), deleteSeason)

// UPDATE a season
router.patch('/:id', requiredRoles(['superAdmin', 'admin', 'manager']), updateSeason)

module.exports = router