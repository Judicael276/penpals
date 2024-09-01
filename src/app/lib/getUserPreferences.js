import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config'; // Assurez-vous que firebaseConfig est correctement configuré

// Fonction pour obtenir les préférences de l'utilisateur connecté
export async function getUserPreferences(userId) {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    throw new Error('Utilisateur non trouvé');
  }
}
