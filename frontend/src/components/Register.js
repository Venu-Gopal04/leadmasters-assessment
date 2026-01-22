import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://leadmasters-assessment.onrender.com/api/auth/register', { email, password });
            alert("Registration Successful! Please Login.");
            navigate('/login');
        } catch (err) {
            console.error(err);
            alert("Registration Failed. Try again.");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <br /><br />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                <br /><br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;