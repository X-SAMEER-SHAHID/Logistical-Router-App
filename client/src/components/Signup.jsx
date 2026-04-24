import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import LoadingSpinner from './LoadingSpinner';

import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const { register, googleLogin } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            return setError('Passwords do not match');
        }
        setIsLoading(true);
        try {
            await register({ 
                email, 
                password1: password, 
                password2: passwordConfirm 
            });
            navigate('/dashboard');
        } catch (err) {
            if (err.response?.data) {
                const firstErrorKey = Object.keys(err.response.data)[0];
                const firstErrorMsg = err.response.data[firstErrorKey][0];
                setError(firstErrorMsg || 'Failed to create an account. Please try again.');
            } else {
                setError('Failed to create an account. Please try again.');
            }
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
            setError(backendError || 'Failed to sign up with Google.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        {isLoading && <LoadingSpinner message="Creating your account..." />}
        <div className="flex-grow flex items-center justify-center relative overflow-hidden py-12 w-full h-full min-h-[80vh]">
            {/* Abstract Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary-container/20 blur-[100px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary-fixed/30 blur-[120px]"></div>
            
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 px-4 sm:px-6">
                {/* Left Side: Brand & Visual Context */}
                <div className="hidden lg:flex flex-col space-y-8">
                    <div className="space-y-4">
                        <span className="bg-secondary-container/20 text-secondary px-3 py-1 rounded-full text-label-caps font-label-caps inline-block">FOR DISPATCHERS</span>
                        <h1 className="font-display-lg text-display-lg text-primary tracking-tighter">
                            Empowering the world's most <span className="text-secondary">efficient</span> logistics networks.
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                            Join over 10,000 professional dispatchers using Logistics Router to optimize routes, manage shipments, and scale global operations.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-card p-card-padding rounded-xl shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                            <span className="material-symbols-outlined text-secondary mb-2">speed</span>
                            <h3 className="font-title-sm text-title-sm text-on-surface mb-1">Real-time Analytics</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">Live tracking and performance metrics at your fingertips.</p>
                        </div>
                        <div className="glass-card p-card-padding rounded-xl shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                            <span className="material-symbols-outlined text-secondary mb-2">route</span>
                            <h3 className="font-title-sm text-title-sm text-on-surface mb-1">Smart Routing</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">AI-driven route optimization to save time and fuel costs.</p>
                        </div>
                    </div>
                    
                    <div className="relative rounded-xl overflow-hidden aspect-video shadow-2xl">
                        <img alt="Modern Logistics Hub" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCedzJpbgQtOIo56oEr4EMGshutPh7qcbdp-EOdW5YwFRPBr6YSf4E9hLfKUweWRQe8AU3f1TA4lx_8-ygfKpQJe-angGRLphFycjfF2q77mk-jkh3ImxGP84pz-ouva6ypky8H5qL83d2A0CM5jMVJJ2qiFwTMOjHVZnS1HEDINWAENLIaHX3FIG-8YCXLpdou6y1cKIh2RVr0zZyQoL_dHlbsQiQ_sOr6E1l2bPpYIXXsnanSQSfaWQFmkujFUyyHkf8TKecHzaw"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                            <p className="text-white italic font-body-md text-body-md">"Logistics Router transformed our dispatch operations, reducing idle time by 34%." – Operations Director, Global Trans</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Signup Card */}
                <div className="flex justify-center">
                    <div className="glass-card w-full max-w-md rounded-xl p-card-padding shadow-[0_20px_50px_rgba(15,23,42,0.1)] flex flex-col space-y-6">
                        <div className="text-center lg:text-left space-y-2">
                            <div className="lg:hidden font-display-lg text-display-lg text-primary tracking-tighter mb-4">Logistics Router</div>
                            <h2 className="font-headline-md text-headline-md text-primary">Create Account</h2>
                            <p className="font-body-md text-body-md text-on-surface-variant">Enter your professional details to get started.</p>
                        </div>
                        
                        {error && <div className="bg-error-container text-error p-3 rounded-lg text-sm">{error}</div>}

                        {/* Social Signup */}
                        <div className="flex justify-center w-full">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google sign up failed')}
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

                        {/* Signup Form */}
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
                                <label className="font-label-caps text-label-caps text-on-surface-variant ml-1">PASSWORD</label>
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
                            <div className="space-y-2">
                                <label className="font-label-caps text-label-caps text-on-surface-variant ml-1">CONFIRM PASSWORD</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock_reset</span>
                                    <input 
                                        type="password" 
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-surface-container rounded-lg border-transparent focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-md text-body-md outline-none" 
                                        placeholder="••••••••"
                                        value={passwordConfirm}
                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-2 px-1 mt-2">
                                <input required id="terms" type="checkbox" className="mt-1 w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary"/>
                                <label htmlFor="terms" className="font-body-sm text-body-sm text-on-surface-variant">
                                    I agree to the <a className="text-secondary hover:underline transition-all" href="#">Terms of Service</a> and <a className="text-secondary hover:underline transition-all" href="#">Privacy Policy</a>.
                                </label>
                            </div>
                            
                            <button 
                                type="submit"
                                className="w-full mt-2 py-4 bg-gradient-to-r from-secondary to-on-secondary-fixed-variant text-on-secondary font-bold rounded-lg shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 active:scale-[0.98] transition-all duration-150 font-body-md text-body-md tracking-wider"
                            >
                                Create Account
                            </button>
                        </form>
                        
                        <div className="text-center">
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                Already have an account?{' '}
                                <button onClick={() => navigate('/login')} className="text-secondary font-semibold hover:underline">
                                    Sign in
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

export default Signup;
