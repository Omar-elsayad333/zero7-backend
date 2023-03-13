const mongoose = require("mongoose");

mongoose.set('strictQuery', true)

const connectDB = async (app) => {
    try {
		await mongoose.connect(process.env.MONGO_URI)

		// listen for requests
		app.listen(process.env.LIVE_SERVER, () => {
			console.log('connected to db & listening on port', process.env.LIVE_SERVER)
		})

    } catch(error) {
        console.log(error)
    }
}

const db = mongoose.connection

module.exports = { connectDB, db }
