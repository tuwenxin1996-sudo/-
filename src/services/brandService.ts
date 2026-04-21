import { 
  collection, 
  doc, 
  getDoc, 
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

const BRANDS_COLLECTION = 'brands';

export const brandService = {
  async ensureBrandExists(brandId: string, name: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("Auth required");

    const brandRef = doc(db, BRANDS_COLLECTION, brandId);
    const brandDoc = await getDoc(brandRef);

    if (!brandDoc.exists()) {
      // Create the brand if it doesn't exist, owned by current user
      await setDoc(brandRef, {
        name,
        owner_id: user.uid,
        created_at: serverTimestamp()
      });
    } else {
      // Optional: Check if the user is the owner, or if we should update owner
      // In a real app, you wouldn't allow just anyone to claim an existing brand ID
      // but for this demo, if it exists, we assume permissions are handled by rules
    }
  }
};
