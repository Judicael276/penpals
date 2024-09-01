"use client";
import { useState } from 'react';
import { auth,db } from '../../../firebase-config';
import { signInWithEmailAndPassword, signOut,getAuth } from 'firebase/auth';
import styles from '@/styles/Login.module.css';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      setIsLoggedIn(true);
      router.push('/matching');
    } catch (err) {
      console.error('Error logging in:', err.message);
      setError(err.message);
      setSuccess(false);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setSuccess(false);
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Error logging out:', err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {isLoggedIn ? (
          <div className={styles.loggedIn}>
            <p>Vous êtes connecté !</p>
            <button onClick={handleLogout} className={styles.button}>
              Déconnexion
            </button>
          </div>
        ) : (
          <>
            <h2 className={styles.title}>Login</h2>
            <form onSubmit={handleLogin}>
              <div className={styles['form-group']}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <button
                type="submit"
                className={styles.button}
                disabled={loading}
              >
                {loading ? (
                  <span className="loader"></span>
                ) : (
                  'Login'
                )}
              </button>
              {success && !loading && <p className={styles.success}>Connexion réussie !</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;