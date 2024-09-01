// app/home/page.js
"use client";
import { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import { auth,db } from '../../firebase-config';
const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/login');
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.h2}>Page d'accueil</h2>
      {user ? (
        <div>
          <p className={styles.p}>Bienvenue, {user.email}</p>
          <button onClick={handleSignOut} className={styles.button}>
            Déconnexion
          </button>
        </div>
      ) : (
        <p className={styles.p}>Vous n'êtes pas connecté.  <Link href="/login" className={styles.link}>Se connecter</Link></p>
      )}
    </div>
  );
};

export default Home;
