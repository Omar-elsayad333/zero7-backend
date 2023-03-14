require('dotenv').config()
const cors = require('cors')
const express = require('express')
// const passport = require('passport');
const { connectDB } = require('./config/db')
const requestInfo = require('./middlewares/requestInfo')
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Import app routes
const userRoutes = require('./routes/user')
const roleRoutes = require('./routes/roles')
const sizeRoutes = require('./routes/sizes')
const colorRoutes = require('./routes/colors')
const genderRoutes = require('./routes/genders')
const seasonRoutes = require('./routes/seasons')
const productsRoutes = require('./routes/products')
const categoryRoutes = require('./routes/categorys')
const dashboardRoutes = require('./routes/dashboard')

// Express app
const app = express()

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.GOOGLE_CALLBACK_URL
// }, (accessToken, refreshToken, profile, done) => {
//     // This callback function will be called when the authentication is successful
//     // You can use the profile information to create or update a user record in your database
//     // The 'done' function should be called with the user object or 'false' if the authentication fails
// }));

// Middlewares
app.use(cors())
app.use(express.json())
app.use((req, res, next) => requestInfo(req, res, next))
// app.use(passport.initialize());

// User routes
app.use('/api/user/roles', roleRoutes)
app.use('/api/user', userRoutes)

// Dashboard routes
app.use('/api/dashboard', dashboardRoutes)

// Product routes
app.use('/api/products/sizes', sizeRoutes)
app.use('/api/products/colors', colorRoutes)
app.use('/api/products/seasons', seasonRoutes)
app.use('/api/products/genders', genderRoutes)
app.use('/api/products/categorys', categoryRoutes)
app.use('/api/products', productsRoutes)
// app.use('/', (req, res) => {
//     res.status(200).json('welcome to team backend')   
// })

// Google routes
// app.get('/auth/google', passport.authenticate('google', {
//     scope: ['profile', 'email']
// }));
// app.get('/auth/google/callback', passport.authenticate('google', {
//     failureRedirect: '/login',
//     successRedirect: '/'
// }));

// Connect to data base
connectDB(app)

module.exports = app