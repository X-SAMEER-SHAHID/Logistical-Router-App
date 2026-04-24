import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const Dashboard = () => {
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api/v1`;

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await axios.get(`${API_URL}/my-trips/`);
                setTrips(res.data);
            } catch (error) {
                console.error("Failed to fetch trips", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchTrips();
        }
    }, [user, API_URL]);

    if (loading) {
        return <LoadingSpinner message="Loading your trips..." />;
    }

    return (
        <div className="max-w-4xl mx-auto mt-12 mb-20 px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <nav className="flex items-center gap-2 text-label-caps text-outline mb-2">
                        <span>DASHBOARD</span>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <span className="text-secondary">SAVED TRIPS</span>
                    </nav>
                    <h1 className="font-headline-md text-headline-md text-on-surface">My Saved Trips</h1>
                    <p className="text-body-sm text-on-surface-variant">View your route history and compliance logs.</p>
                </div>
            </div>
            
            {trips.length === 0 ? (
                <div className="bg-surface-container-lowest p-12 rounded-3xl shadow-sm border border-outline-variant/30 text-center flex flex-col items-center justify-center min-h-[300px]">
                    <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">route</span>
                    <h3 className="font-title-sm text-title-sm text-on-surface mb-2">No trips found</h3>
                    <p className="text-body-sm text-on-surface-variant">You haven't saved any trips yet. Generate a route to see it here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {trips.map((trip) => (
                        <Link to={`/trip/${trip.id}`} key={trip.id} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center group block cursor-pointer">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">local_shipping</span>
                                </div>
                                <div>
                                    <h3 className="font-title-sm text-title-sm text-on-surface flex items-center gap-2 group-hover:text-secondary transition-colors">
                                        {trip.pickup_loc} 
                                        <span className="material-symbols-outlined text-outline text-[16px]">arrow_forward</span> 
                                        {trip.dropoff_loc}
                                    </h3>
                                    <p className="text-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                        {new Date(trip.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 bg-surface-container-low px-4 py-3 rounded-xl border border-outline-variant/20 w-full sm:w-auto">
                                <div className="text-center sm:text-right">
                                    <span className="text-label-caps text-outline font-label-caps block mb-1">DISTANCE</span>
                                    <div className="font-title-sm text-title-sm text-on-surface">{trip.total_distance.toFixed(1)} mi</div>
                                </div>
                                <div className="w-px h-8 bg-outline-variant/30"></div>
                                <div className="text-center sm:text-right">
                                    <span className="text-label-caps text-outline font-label-caps block mb-1">DURATION</span>
                                    <div className="font-title-sm text-title-sm text-on-surface">{trip.total_duration.toFixed(1)} hrs</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
