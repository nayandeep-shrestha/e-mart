import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

const serviceAccount: ServiceAccount = require('../path/to/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://emart-3f43d.appspot.com",
});
const bucket = admin.storage().bucket();
export { bucket };
