import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Critical: Connection test as per instructions
async function testConnection() {
  try {
    // Attempt to read a dummy document to verify connectivity/config
    await getDocFromServer(doc(db, '_internal_', 'connection_test'));
  } catch (error) {
    if (error instanceof Error && (error.message.includes('offline') || error.message.includes('permission-denied'))) {
      console.warn("Firebase connection test noticed an issue (this is expected if rules/docs are fresh):", error.message);
    }
  }
}

testConnection();
