/**
 * Get unique suffix name for file.
 *
 * @param {object} file The file object.
 * @returns {string} file unique suffix name.
 */
const uniqueSuffix = (fileExt) => {
  return `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`
}

/**
 * Get file extension by spliting file (mimetype).
 *
 * @param {object} file The file object.
 * @returns {string} file extension.
 */
const fileExt = (file) => {
  return file.mimetype?.split('/')[1]
}

module.exports = {
  uniqueSuffix,
  fileExt,
}
