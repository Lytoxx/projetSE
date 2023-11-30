const mongoose = require('mongoose'); 

const connectedDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, { 
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
        })
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error: ${error.message} `)
        process.exit()
    }
}
module.exports = connectedDB;