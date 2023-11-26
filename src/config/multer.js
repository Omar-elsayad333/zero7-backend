const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/test')
  },
  filename: function (req, file, cb) {
    console.log(file)
    const fileExt = file.mimetype.split('/')[1]
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`
    cb(null, file.fieldname + '-' + uniqueSuffix)
  },
})
const upload = multer({ storage: storage })
