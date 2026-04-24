import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import LoadingSpinner from './LoadingSpinner';

import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const { login, googleLogin } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        try {
            await googleLogin(credentialResponse.credential);
            navigate('/dashboard');
        } catch (err) {
            console.error("Google login error:", err);
            const backendError = err.response?.data?.error;
            setError(backendError || 'Failed to log in with Google.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        {isLoading && <LoadingSpinner message="Signing you in..." />}
        <div className="flex-grow flex items-center justify-center relative overflow-hidden py-12 w-full h-full min-h-[80vh]">
            {/* Abstract Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary-container/20 blur-[100px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary-fixed/30 blur-[120px]"></div>
            
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 px-4 sm:px-6">
                {/* Left Side: Brand & Visual Context */}
                <div className="hidden lg:flex flex-col space-y-8">
                    <div className="space-y-4">
                        <h1 className="font-display-lg text-display-lg text-primary tracking-tighter">
                            LogiFlow
                        </h1>
                        <p className="font-title-sm text-title-sm text-on-surface-variant max-w-md">
                            The global standard for logistics excellence. Precision routing and real-time supply chain intelligence at your fingertips.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-card p-card-padding rounded-xl shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                            <span className="material-symbols-outlined text-secondary mb-2">speed</span>
                            <h3 className="font-title-sm text-title-sm text-on-surface">Ultra-Fast</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">Real-time route optimization in seconds.</p>
                        </div>
                        <div className="glass-card p-card-padding rounded-xl shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                            <span className="material-symbols-outlined text-secondary mb-2">public</span>
                            <h3 className="font-title-sm text-title-sm text-on-surface">Global</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">Connected to 200+ logistics hubs worldwide.</p>
                        </div>
                    </div>
                    <div className="relative rounded-xl overflow-hidden shadow-2xl h-[280px]">
                        <img alt="Modern Logistics Hub" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3Cp01gtrd_fsyNkqDdx3677SkM_iWqerN5IafCrfoPVbdnEg9EsfQetMvEf_o_K7wyBDLj6PLmFKNHWDsenYG4wPjBtuTb1KNqniFRM4KKPVH6k-2BlmSWB6MbWGwkKmX_BJ0IdiS2jZoBwXAy6tdlmGZ41TclWWQGxopMJXheYnGV8nsvxTGXqIN-rix17pY0Wk-f_5zqQFhQBMZUw8RUikWFcZhtKMHIJMm8DIAI00DlvuTQ7Ms5tz7Y-RucH_3QzGeivuWKPs"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <p className="font-label-caps text-label-caps opacity-80 mb-1">LIVE NETWORK STATUS</p>
                            <p className="font-title-sm text-title-sm">Operational in all regions</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Card */}
                <div className="flex justify-center">
                    <div className="glass-card w-full max-w-md rounded-xl p-card-padding shadow-[0_20px_50px_rgba(15,23,42,0.1)] flex flex-col space-y-6">
                        <div className="text-center lg:text-left space-y-2">
                            <div className="lg:hidden font-display-lg text-display-lg text-primary tracking-tighter mb-4">LogiFlow</div>
                            <h2 className="font-headline-md text-headline-md text-on-surface">Welcome Back</h2>
                            <p className="font-body-md text-body-md text-on-surface-variant">Please enter your details to sign in.</p>
                        </div>
                        
                        {error && <div className="bg-error-container text-error p-3 rounded-lg text-sm">{error}</div>}

                        {/* Social Login */}
                        <div className="flex justify-center w-full">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google login failed')}
                                useOneTap
                                theme="filled_blue"
                                shape="pill"
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="h-px bg-outline-variant flex-grow"></div>
                            <span className="font-label-caps text-label-caps text-outline">OR EMAIL</span>
                            <div className="h-px bg-outline-variant flex-grow"></div>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="font-label-caps text-label-caps text-on-surface-variant ml-1">WORK EMAIL</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">mail</span>
                                    <input 
                                        type="email" 
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-surface-container rounded-lg border-transparent focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-md text-body-md outline-none" 
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="font-label-caps text-label-caps text-on-surface-variant">PASSWORD</label>
                                    <a className="font-label-caps text-label-caps text-secondary hover:underline transition-all" href="#">Forgot?</a>
                                </div>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock</span>
                                    <input 
                                        type="password" 
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-surface-container rounded-lg border-transparent focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-md text-body-md outline-none" 
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 px-1">
                                <input id="remember" type="checkbox" className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary"/>
                                <label htmlFor="remember" className="font-body-sm text-body-sm text-on-surface-variant">Stay signed in for 30 days</label>
                            </div>
                            <button 
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-secondary to-on-secondary-fixed-variant text-on-secondary font-bold rounded-lg shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 active:scale-[0.98] transition-all duration-150 font-body-md text-body-md uppercase tracking-wider"
                            >
                                Sign In to Dashboard
                            </button>
                        </form>
                        
                        <div className="text-center">
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                Don't have an account?{' '}
                                <button onClick={() => navigate('/signup')} className="text-secondary font-semibold hover:underline">
                                    Sign up
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Login;
