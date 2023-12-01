const admin = require('firebase-admin')
const serviceAccount = require('path/to/your/serviceAccountKey.json') // Download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-project-id.appspot.com', // Replace with your bucket name
})

const bucket = admin.storage().bucket()

module.exports = {
  bucket,
}
