import admin from 'firebase-admin';

if (!admin.apps.length) {
  console.log('process.env.FIREBASE_SERVICE_ACCOUNT', !!process.env.FIREBASE_SERVICE_ACCOUNT);
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
  }
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auth: admin.auth.Auth = admin.auth();
const db = admin.firestore();

export { auth, db };
