const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    }
}, {
    timestamp: true
})
const user = mongoose.model("user", userSchema)
module.exports = user

