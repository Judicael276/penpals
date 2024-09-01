"use client";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import MessageForm from '../../components/MessageForm'; // Assurez-vous que le chemin est correct

export default function MessagePage() {
  const router = useRouter();
  const { userId } = router.query; // Récupère l'ID de l'utilisateur à partir de l'URL
  const [currentUserId, setCurrentUserId] = useState(''); // Remplacez par l'ID réel de l'utilisateur connecté

  useEffect(() => {
    const auth = getAuth();
      const user = auth.currentUser;
    // Fonction pour récupérer l'ID de l'utilisateur connecté (peut être depuis un contexte ou un hook)
    const fetchCurrentUserId = async () => {
      // Remplacez cette ligne par votre méthode pour récupérer l'ID de l'utilisateur connecté
      const id = user.uid; // Remplacez par la méthode réelle
      setCurrentUserId(id);
    };

    fetchCurrentUserId();
  }, []);

  return (
    <div>
      <h1>Send a Message</h1>
      {currentUserId && userId && (
        <MessageForm senderId={currentUserId} receiverId={userId} />
      )}
    </div>
  );
}
