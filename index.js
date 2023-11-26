require('dotenv').config()
const cors = require('cors')
const morgan = require('morgan')
const multer = require('multer')
const express = require('express')
const { connectDB } = require('./src/config/db')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/test')
  },
  filename: function (req, file, cb) {
    console.log(file)
    const fileExt = file.mimetype.split('/')[1]
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`
    cb(null, file.fieldname + '-' + uniqueSuffix)
  },
})
const upload = multer({ storage: storage })

// Import app routes
const userRoutes = require('./src/routes/user')
const roleRoutes = require('./src/routes/roles')
const sizeRoutes = require('./src/routes/sizes')
const colorRoutes = require('./src/routes/colors')
const genderRoutes = require('./src/routes/genders')
const seasonRoutes = require('./src/routes/seasons')
const productsRoutes = require('./src/routes/products')
const categoryRoutes = require('./src/routes/categorys')
const dashboardRoutes = require('./src/routes/dashboard')

// Express app
const app = express()

// Middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// User routes
app.use(`${process.env.BASE_API_V}/roles`, roleRoutes)
app.use(`${process.env.BASE_API_V}/user`, upload.single('testImage'), userRoutes)

// Dashboard routes
app.use(`${process.env.BASE_API_V}/dashboard`, dashboardRoutes)

// Website routes
app.use(`${process.env.BASE_API_V}/products/sizes`, sizeRoutes)
app.use(`${process.env.BASE_API_V}/products/colors`, colorRoutes)
app.use(`${process.env.BASE_API_V}/products/seasons`, seasonRoutes)
app.use(`${process.env.BASE_API_V}/products/genders`, genderRoutes)
app.use(`${process.env.BASE_API_V}/products/categorys`, categoryRoutes)
app.use(`${process.env.BASE_API_V}/products`, productsRoutes)

// Connect to data base
connectDB(app)

module.exports = app
