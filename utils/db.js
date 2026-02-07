const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("server is connected to db ")
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1)
    }
}

module.exports = connectDB