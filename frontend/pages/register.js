// frontend/pages/register.js
import styles from '../styles/styles.module.css';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                username,
                password,
            });
            router.push('/login'); // Redirect to login
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
