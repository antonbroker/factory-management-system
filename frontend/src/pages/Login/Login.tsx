import React, { FormHTMLAttributes, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { login } from '../../api/auth'
import { LoginResponse } from '../../types/Login'
import './Login.css'

const Login: React.FC = () => {

    const navigate = useNavigate() 

    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [error, setError] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")
    
        // === VALIDATION ===
        if (!username.trim() && !email.trim()) {
            setError("All fields are required!")
            return
        }
    
        if (!username.trim()) {
            setError("Username can't be empty!")
            return
        }
    
        const regex = /^[a-zA-Z0-9._]+$/
    
        if (!regex.test(username)) {
            setError("Username can contain only letters!")
            return
        }
    
        if (!email.trim()) {
            setError("Email field cannot be empty!")
            return
        }
    
        if (!email.includes("@") || !email.includes(".")) {
            setError("Email must contain valid format!")
            return
        }
    
        // === SEND REQUEST ===
        try {
            const data = await login(username, email)
            sessionStorage.setItem('token', data.token)
            navigate('/employees', { replace: true })

        } catch (err) {
                console.error(err);
                setError("Server error!")
        }
    }

    return (
        <div className="login-wrapper">
    
            {/* Gears */}
            <div className="gear gear-1"></div>
            <div className="gear gear-2"></div>
            <div className="gear gear-3"></div>
        
            {/* Particles */}
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
        
            <main>
                <p className="error">{error}</p>
        
                <h1>Factory</h1>
        
                <form onSubmit={handleSubmit}>
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
            
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
            
                    <button type="submit">LOGIN</button>
                </form>
        
                <div className="status-bar">
                    <div className="status-item">
                        <div className="status-dot"></div>
                        <span>SYSTEM</span>
                    </div>
                    <div className="status-item">
                        <div className="status-dot"></div>
                        <span>DATABASE</span>
                    </div>
                    <div className="status-item">
                        <div className="status-dot"></div>
                        <span>SECURE</span>
                    </div>
                </div>
            </main>
        </div>
    )
}
    
export default Login
