// File: scripts/upload.js

const admin = require('firebase-admin');
const fs = require('fs');

// IMPORTANT: Path to your Firebase Admin SDK private key
// You will download this in the next step.
const serviceAccount = require('../serviceAccountKey.json');

// IMPORTANT: Your Firestore document details
const collectionName = 'exams';
const documentName = 'ucat-live-exam-a'; // Same ID you used before

// The data to upload
const dataToUpload = JSON.parse(fs.readFileSync('../questions.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadData() {
  try {
    console.log(`Uploading data to: ${collectionName}/${documentName}`);
    await db.collection(collectionName).doc(documentName).set(dataToUpload);
    console.log('✅ Data successfully uploaded!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error uploading data:', error);
    process.exit(1);
  }
}

uploadData();