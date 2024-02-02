const utils = require('../utils')
const { bucket } = require('../config/firebase')
const { getDownloadURL } = require('firebase-admin/storage')

/**
 * Upload file to firebase storage and get the uploaded file URL.
 *
 * @param {object} file The file object.
 * @param {string} folderPath The storage folder path you want to upload into.
 * @returns {string} uploaded file URL.
 */
const uploadeFileToFirebase = async (file, folderPath) => {
  const fileExt = utils.fileExt(file)
  const uniqueFilename = `${folderPath}/${utils.uniqueSuffix(fileExt)}`
  const bucketFile = bucket.file(uniqueFilename)
  await bucketFile.save(file.buffer, { contentType: file.mimetype })

  const fileRef = bucket.file(uniqueFilename)
  const url = await getDownloadURL(fileRef)

  return url
}

module.exports = {
  uploadeFileToFirebase,
}
