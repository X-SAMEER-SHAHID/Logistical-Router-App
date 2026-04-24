import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import TripDetail from './components/TripDetail';
import { useAuth } from './contexts/AuthContext';

function App() {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (loading) return <LoadingSpinner message="Initializing Logistics Router..." />;

    return (
        <div className="min-h-screen bg-background font-body-md text-on-background antialiased overflow-x-hidden flex flex-col">
            {/* Header / Navbar */}
            <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 top-0 sticky z-50 shadow-[0_10px_30px_rgba(15,23,42,0.05)] font-manrope tracking-tight">
                <div className="flex justify-between items-center w-full px-4 sm:px-6 py-3 sm:py-4 max-w-7xl mx-auto gap-2">
                    <Link to="/" className="text-base sm:text-xl font-extrabold text-primary tracking-tighter flex items-center gap-1 sm:gap-2 shrink-0 max-w-[150px] sm:max-w-none">
                        <span className="material-symbols-outlined text-secondary text-xl sm:text-2xl shrink-0">route</span>
                        <span className="truncate leading-tight">Logistics Router</span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-on-surface-variant font-medium hover:text-secondary transition-colors text-sm sm:text-base">Dashboard</Link>
                                <button onClick={handleLogout} className="p-1.5 sm:p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all flex items-center justify-center group" title="Logout">
                                    <span className="material-symbols-outlined text-xl sm:text-2xl group-hover:text-error transition-colors">logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-on-surface-variant font-medium hover:text-secondary transition-colors text-sm sm:text-base">Log In</Link>
                                <Link to="/signup" className="bg-gradient-to-r from-secondary to-on-secondary-fixed-variant text-on-secondary px-3 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs sm:text-base font-semibold shadow-lg shadow-secondary/20 hover:shadow-xl active:scale-95 transition-all duration-150 whitespace-nowrap">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow w-full relative">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={
                        user ? <Dashboard /> : <Login />
                    } />
                    <Route path="/trip/:id" element={
                        user ? <TripDetail /> : <Login />
                    } />
                </Routes>
            </main>

            {/* Footer */}
            <footer className="bg-surface-container-low border-t border-outline-variant w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-8 py-12 max-w-7xl mx-auto">
                    <div>
                        <div className="text-lg font-bold text-primary mb-4 font-manrope">Logistics Router</div>
                        <p className="font-body-sm text-on-surface-variant max-w-xs mb-6">
                            The global standard for intelligent logistics orchestration and supply chain visibility.
                        </p>
                        <div className="text-on-surface-variant text-sm">
                            © 2026 Logistics Router Inc.
                        </div>
                    </div>
                    <div className="flex gap-x-8 md:justify-end">
                        <a className="font-body-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">Privacy Policy</a>
                        <a className="font-body-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
