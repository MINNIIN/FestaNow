const admin = require('firebase-admin');
const serviceAccount = require('C:/cliProject/festanow-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = db;