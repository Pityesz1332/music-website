import React, { useState } from "react";
import "../styles/LoginModal.css";

function LoginModal({ isOpen, onClose }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    if (!isOpen) return null;

    function handleLogin() {
        console.log("Login:", email, password);
        onClose();
    };

    function handleCreateAccount() {
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Sign in to Your Account</h2>
                <p className="modal-subtitle">Start Listening</p>

                <div className="form-group">
                    <label>Email</label>
                    <input 
                        type="email"
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="modal-buttons">
                    <button className="create-btn" onClick={handleCreateAccount}>
                        Create Account
                    </button>
                    <button className="login-btn" onClick={handleLogin}>
                        Log In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;