const multer = require('multer')
const utils = require('../utils')

// Storing files on disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/images')
  },
  filename: function (req, file, cb) {
    const fileExt = utils.fileExt(file)
    const uniqueSuffix = utils.uniqueSuffix(fileExt)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  },
})
const upload = multer({ storage: storage })

// Storing files on memory
const memoryStorage = multer.memoryStorage()
const memoryUpload = multer({ storage: memoryStorage })

module.exports = { upload, memoryUpload }
