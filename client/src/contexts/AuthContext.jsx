import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api/v1`;

    const checkUser = async () => {
        try {
            const res = await axios.get(`${API_URL}/auth/user/`);
            setUser(res.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login/`, { email, password });
            setUser(res.data.user);
            return res.data;
        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message);
            throw error;
        }
    };

    const register = async (data) => {
        try {
            const res = await axios.post(`${API_URL}/auth/registration/`, data);
            setUser(res.data.user);
            return res.data;
        } catch (error) {
            console.error("Register Error:", error.response?.data || error.message);
            throw error;
        }
    };

    const logout = async () => {
        await axios.post(`${API_URL}/auth/logout/`);
        setUser(null);
    };

    // Google Login handles its own logic, we just need to hit our backend endpoint
    // to exchange the access token for cookies
    const googleLogin = async (credential) => {
        try {
            const res = await axios.post(`${API_URL}/auth/google/`, {
                access_token: credential, // Some versions of dj-rest-auth expect it here
                id_token: credential,     // The new GIS standard expects it here
            });
            setUser(res.data.user);
            return res.data;
        } catch (error) {
            console.error("Google Auth Backend Error:", error.response?.data || error.message);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, googleLogin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
