// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { storage } from './firebaseConfig'; // Assurez-vous que firebaseConfig est correctement configuré

// // Fonction pour télécharger un fichier vers Firebase Storage
// export async function uploadMedia(file) {
//   try {
//     const fileRef = ref(storage, `media/${file.name}`);
//     await uploadBytes(fileRef, file);
//     const url = await getDownloadURL(fileRef);
//     return url;
//   } catch (error) {
//     console.error('Erreur lors du téléchargement du fichier:', error);
//     return null;
//   }
// }
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../firebase-config'; // Assurez-vous que firebaseConfig est correctement configuré

// Fonction pour envoyer un message
export async function sendMessage(senderId, receiverId, text, mediaUrl, mediaType) {
  try {
    await addDoc(collection(db, 'messages'), {
      senderId,
      receiverId,
      text: text || null,
      mediaUrl: mediaUrl || null,
      mediaType: mediaType || null,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
  }
}
