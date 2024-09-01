// pages/signup.js
"use client";
import { useState,useEffect } from 'react';
import { AutoComplete } from "primereact/autocomplete";
import { auth,db } from '../../../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { CountryService } from '@/data/CountryService';
import styles from '@/styles/Signup.module.css'

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState(null);

  const [languages, setLanguages] = useState('');
  const [interests, setInterests] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const search = (event) => {
    // Timeout to emulate a network connection
    setTimeout(() => {
        let _filteredCountries;

        if (!event.query.trim().length) {
            _filteredCountries = [...countries];
        }
        else {
            _filteredCountries = countries.filter((country) => {
                return country.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }

        setFilteredCountries(_filteredCountries);
    }, 250);
  }

  useEffect(() => {
      CountryService.getCountries().then((data) => setCountries(data));
  }, []);

  const calculateAge = (year, month, day) => {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const age = calculateAge(dobYear, dobMonth, dobDay);

    if (age < 18) {
      alert('Vous êtes mineur.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user profile to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        userId: user.uid,
        name,
        email,
        dateOfBirth: {
          year: dobYear,
          month: dobMonth,
          day: dobDay
        },
        country,
        languages: languages.split(',').map(lang => lang.trim()), // Convert comma-separated string to array
        interests: interests.split(',').map(interest => interest.trim()), // Convert comma-separated string to array
        lookingFor
      });

      setSuccess(true);
      setEmail('');
      setPassword('');
      setName('');
      setDobYear('');
      setDobMonth('');
      setDobDay('');
      setCountry('');
      setLanguages('');
      setInterests('');
      setLookingFor('');
    } catch (err) {
      console.error('Error signing up:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className={styles['form-group']}>
            <label htmlFor="name" className={styles.label}>Name</label>
            <input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
            />
          </div>
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
          <div className={styles['form-group']}>
            <label htmlFor="dobYear" className={styles.label}>Date of Birth</label>
            <div className="flex space-x-2">
              <input
                id="dobYear"
                type="number"
                placeholder="Year"
                value={dobYear}
                onChange={(e) => setDobYear(e.target.value)}
                required
                className={styles.input}
              />
              <input
                id="dobMonth"
                type="number"
                placeholder="Month"
                value={dobMonth}
                onChange={(e) => setDobMonth(e.target.value)}
                required
                className={styles.input}
              />
              <input
                id="dobDay"
                type="number"
                placeholder="Day"
                value={dobDay}
                onChange={(e) => setDobDay(e.target.value)}
                required
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="country" className={styles.label}>Country</label>
            <div className="card flex justify-content-center">
              <AutoComplete  field="name" value={country} suggestions={filteredCountries} completeMethod={search} onChange={(e) => setCountry(e.value)} />
            </div>
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="languages" className={styles.label}>Languages (comma-separated)</label>
            <input
              id="languages"
              type="text"
              placeholder="Languages"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="interests" className={styles.label}>Interests (comma-separated)</label>
            <input
              id="interests"
              type="text"
              placeholder="Interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="lookingFor" className={styles.label}>Looking for</label>
            <textarea
              id="lookingFor"
              placeholder="Looking for (e.g., someone to practice a language, exchange letters, etc.)"
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
              required
              className={`${styles.input} ${styles.textarea}`}
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
              'Sign Up'
            )}
          </button>
        </form>
        {success && <div className={styles.success}>Inscription réussie !</div>}
      </div>
    </div>
  );
};
export default Signup;
