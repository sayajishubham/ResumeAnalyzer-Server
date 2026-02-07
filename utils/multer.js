const multer = require('multer');


const Upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only pdf are allowed"), false)
        }
    }
})
// Ensure uploads directory exists
module.exports = Upload