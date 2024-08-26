const admin = require('firebase-admin');
const path = require('path');

// Use a relative path to the service account key JSON file
const serviceAccount = require(path.resolve(__dirname, 'config/serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'job-portal-demo-8414e.appspot.com' // Your Firebase Storage bucket URL
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
