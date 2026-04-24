import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTripDetail } from '../services/tripService';
import RouteMap from './RouteMap';
import LogSheetViewer from './LogSheetViewer';
import LoadingSpinner from './LoadingSpinner';

const TripDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const result = await getTripDetail(id);
                setData(result);
            } catch (err) {
                setError(err.response?.data?.error || err.message || "Failed to load trip");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrip();
    }, [id]);

    if (isLoading) {
        return <LoadingSpinner message="Loading route and log sheets..." />;
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto mt-12 mb-20 px-4 sm:px-6 text-center">
                <div className="bg-error-container text-error p-6 rounded-2xl">
                    <span className="material-symbols-outlined text-4xl mb-2">error</span>
                    <h2 className="font-headline-md text-headline-md mb-2">Failed to load trip</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/dashboard')} className="mt-4 px-6 py-2 bg-error text-on-error rounded-xl font-bold">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="animate-in slide-in-from-bottom-8 fade-in duration-700 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <nav className="flex items-center gap-2 text-label-caps text-outline mb-2">
                        <Link to="/dashboard" className="hover:text-secondary transition-colors">DASHBOARD</Link>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <span className="text-secondary">TRIP #{id}</span>
                    </nav>
                    <h1 className="font-headline-md text-headline-md text-on-surface">Route & Compliance Overview</h1>
                    <p className="text-body-sm text-on-surface-variant flex items-center gap-2">
                        <span className="font-bold text-on-surface">{data.pickup_loc}</span> 
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span> 
                        <span className="font-bold text-on-surface">{data.dropoff_loc}</span>
                    </p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-2.5 bg-surface-container-highest text-on-surface font-semibold rounded-xl flex items-center gap-2 hover:bg-surface-variant transition-all font-title-sm text-title-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        Back
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Left Column: Map */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    <div className="relative rounded-3xl overflow-hidden border border-outline-variant/30 shadow-xl bg-surface-container-lowest">
                        <RouteMap data={data} />
                    </div>

                    {data.events && data.events.length > 0 && (
                        <div className="bg-surface-container-lowest rounded-3xl p-card-padding border border-outline-variant/30 shadow-sm overflow-hidden">
                            <h3 className="font-title-sm text-title-sm flex items-center gap-2 mb-6 border-b border-outline-variant/20 pb-4">
                                <span className="material-symbols-outlined text-secondary">history</span>
                                Log Sheets
                            </h3>
                            <LogSheetViewer events={data.events} />
                        </div>
                    )}
                </div>
                
                {/* Right Column: HOS Summary */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    <div className="bg-surface-container-lowest rounded-3xl p-card-padding border border-outline-variant/30 shadow-sm">
                        <h3 className="font-title-sm text-title-sm mb-6 pb-4 border-b border-outline-variant/20">Trip Metrics</h3>
                        <ul className="space-y-4">
                            <li className="flex justify-between items-center p-3 bg-surface-bright rounded-xl border border-outline-variant/20">
                                <span className="text-label-caps text-outline font-label-caps">TOTAL DISTANCE</span>
                                <span className="font-title-sm text-title-sm font-bold text-on-surface">{data.total_distance?.toFixed(1)} mi</span>
                            </li>
                            <li className="flex justify-between items-center p-3 bg-surface-bright rounded-xl border border-outline-variant/20">
                                <span className="text-label-caps text-outline font-label-caps">TOTAL DURATION</span>
                                <span className="font-title-sm text-title-sm font-bold text-on-surface">{data.total_duration?.toFixed(1)} hrs</span>
                            </li>
                            <li className="flex justify-between items-center p-3 bg-secondary-fixed/10 rounded-xl border border-secondary/10">
                                <span className="text-label-caps text-secondary font-label-caps">DAYS REQUIRED</span>
                                <span className="font-title-sm text-title-sm font-bold text-secondary">{data.events ? new Set(data.events.map(e => e.day)).size : 1}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripDetail;
