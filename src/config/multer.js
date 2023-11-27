const multer = require('multer')

// Storing files on disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/images')
  },
  filename: function (req, file, cb) {
    const fileExt = file.mimetype.split('/')[1]
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`
    cb(null, file.fieldname + '-' + uniqueSuffix)
  },
})
const upload = multer({ storage: storage })

// Storing files on memory
const memoryStorage = multer.memoryStorage()
const memoryUpload = multer({ storage: memoryStorage })

module.exports = { upload, memoryUpload }
