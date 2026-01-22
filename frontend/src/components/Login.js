import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token); 
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert("Invalid Credentials");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 style={{ marginBottom: '5px', fontSize: '2rem' }}>Welcome Back</h2>
                <p style={{ color: '#64748b', marginBottom: '30px' }}>Please enter your details to sign in.</p>
                
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" style={{ width: '100%', marginTop: '10px' }}>Sign In</button>
                </form>
                
                <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#64748b' }}>
                    Don't have an account? <Link to="/register" style={{ color: '#6366f1', fontWeight: 'bold' }}>Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;