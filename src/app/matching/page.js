// pages/matching.js
"use client";
// pages/matching.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { matchProfiles } from '../lib/matchProfiles'; // Assurez-vous que le chemin est correct
import styles from '@/styles/Matching.module.css';

const MatchingPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
      const auth = getAuth();
      const user = auth.currentUser;

    if (user) {
      const fetchProfiles = async () => {
        try {
          const results = await matchProfiles(user.uid);
          setProfiles(results);
        } catch (error) {
          console.error('Erreur lors de la récupération des profils:', error);
        }
        setLoading(false);
      };

      fetchProfiles();
    } else {
      router.push('/login'); // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
    }
  }, [router]);
  const handleSendMessageClick = (userId) => {
    router.push(`/messages/${userId}`);
  };
  if (loading) {
    return <p>Chargement des profils...</p>;
  }

  return (
    <div className={styles.container}>
      <h2>Profils Correspondants</h2>
      {profiles.length > 0 ? (
        <ul>
          {profiles.map(profile => (
            <li key={profile.userId} className={styles.profileCard}>
              <h3>{profile.name}</h3>
              <p>Langues: {profile.languages.join(', ')}</p>
              <p>Intérêts: {profile.interests.join(', ')}</p>
              <p>Pays: {profile.country.name}</p>
              <button onClick={() => handleSendMessageClick(profile.userId)}>Send Message</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun profil correspondant trouvé.</p>
      )}
    </div>
  );
};

export default MatchingPage;
