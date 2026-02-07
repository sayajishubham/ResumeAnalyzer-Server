const express = require("express");
const userController = require("../controllers/user.controller");
const UserRouter = express.Router()


UserRouter.post('/signIn', userController.SignIn)




module.exports = UserRouter


