import { getDocs, collection, query, where } from 'firebase/firestore';
import { getUserPreferences } from './getUserPreferences'; // Assurez-vous que le chemin est correct
import { db } from '../../../firebase-config'; // Assurez-vous que firebaseConfig est correctement configuré

export async function matchProfiles(userId) {
  try {
    const userPreferences = await getUserPreferences(userId);
    const { languages, interests, country } = userPreferences;
    console.log(userPreferences)
    const usersRef = collection(db, 'users');

    // Requête pour les langues
    let languageResults = [];
    if (languages && languages.length > 0) {
      const qLanguages = query(usersRef, where('languages', 'array-contains-any', languages));
      const querySnapshotLanguages = await getDocs(qLanguages);
      languageResults = querySnapshotLanguages.docs.map(doc => doc.data());
    }

    // Requête pour les intérêts
    let interestResults = [];
    if (interests && interests.length > 0) {
      const qInterests = query(usersRef, where('interests', 'array-contains-any', interests));
      const querySnapshotInterests = await getDocs(qInterests);
      interestResults = querySnapshotInterests.docs.map(doc => doc.data());
    }

    // Fusionner les résultats
    const combinedResults = [...languageResults, ...interestResults];

    // Éviter les doublons
    const uniqueResults = Array.from(new Set(combinedResults.map(a => a.id)))
      .map(id => combinedResults.find(a => a.id === id));

    // Requête pour le pays
    if (country && country.name) {
      const qCountry = query(usersRef, where('country.name', '==', country.name));
      const querySnapshotCountry = await getDocs(qCountry);
      const countryResults = querySnapshotCountry.docs.map(doc => doc.data());

      // Fusionner les résultats avec les résultats combinés
      const allResults = [...uniqueResults, ...countryResults];
      return Array.from(new Set(allResults.map(a => a.id)))
        .map(id => allResults.find(a => a.id === id));
    } else {
      return uniqueResults;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des profils:', error);
    return [];
  }
}
