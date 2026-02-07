const express = require("express")
const Upload = require("../utils/multer")
const resumeController = require("../controllers/resume.controller")
const resumeRouter = express.Router()



resumeRouter.post('/UploadResume', Upload.single('resume'), resumeController.completeAnalysis);


module.exports = resumeRouter