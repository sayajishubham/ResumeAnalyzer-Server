const express = require('express')
const cors = require("cors")
const app = express()
require("dotenv").config();


// middleware
app.use(cors({
    origin: process.env.VITE_API_BASE_URL,
    credentials: true
}))
app.use(express.json())
const resumeRouter = require('./Router/resume.Router');
const connectDB = require('./utils/db');
const UserRouter = require('./Router/user.Router');


// Router

app.use('/resume', resumeRouter)
app.use('/user', UserRouter)


// Conncetion and running server 
const StartServer = async () => {
    await connectDB();
    app.listen(process.env.PORT, async () => {
        console.log('server is running ')
    })
}
StartServer()