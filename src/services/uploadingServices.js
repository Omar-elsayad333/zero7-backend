const { bucket } = require('../config/firebase')

const uploadSingleFile = async (req) => {
  try {
    const file = req.file
    const fileName = `${Date.now()}_${file.originalname}`
    const fileUpload = bucket.file(fileName)

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    })

    blobStream.on('error', (error) => {
      throw new Error('Unable to upload the file.')
    })

    blobStream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
      // Save publicUrl to your database associated with the user
      return { filePath: publicUrl }
    })

    blobStream.end(file.buffer)
  } catch (error) {
    throw new Error('Internal Server Error')
  }
}

module.exports = {
  uploadSingleFile,
}
