"use client";
import { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config'
import styles from '@/styles/Search.module.css';

const Search = () => {
  const [language, setLanguage] = useState('');
  const [interest, setInterest] = useState('');
  const [countryInput, setCountryInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const usersRef = collection(db, 'users');
      let q = query(usersRef);

      if (language) {
        q = query(q, where('languages', 'array-contains', language));
      }
      if (interest) {
        q = query(q, where('interests', 'array-contains', interest));
      }
      if (countryInput) {
        q = query(q, where('country.name', '==', countryInput));
      }

      const querySnapshot = await getDocs(q);
      const userList = querySnapshot.docs.map((doc) => doc.data());
      setResults(userList);
    } catch (err) {
      setError('An error occurred during the search. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSearch} className={styles.form}>
        <div className={styles['form-group']}>
          <label htmlFor="language" className={styles.label}>Language</label>
          <input
            id="language"
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="interest" className={styles.label}>Interest</label>
          <input
            id="interest"
            type="text"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles['form-group']}>
          <label className={styles.label}>Pays</label>
          <input
            type="text"
            value={countryInput}
            onChange={(e) => setCountryInput(e.target.value)}
            className={styles.input}
            placeholder="Ex: Afghanistan ou AF"
          />
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? <span className="loader"></span> : 'Search'}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.results}>
        {results.map((user, index) => (
          <div key={index} className={styles.result}>
            <p>Name: {user.name}</p>
            <p>Languages: {user.languages.join(', ')}</p>
            <p>Interests: {user.interests.join(', ')}</p>
            <p>Country: {user.country.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;