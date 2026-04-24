import React from 'react';
import { useRoutingData } from '../hooks/useRoutingData';
import { useAuth } from '../contexts/AuthContext';
import TripInputForm from './TripInputForm';
import RouteMap from './RouteMap';
import LogSheetViewer from './LogSheetViewer';
import LoadingSpinner from './LoadingSpinner';

const Home = () => {
    const { user } = useAuth();
    const { isLoading, error, data, submitTrip, resetData } = useRoutingData();

    return (
        <div className="w-full">
            {/* Input Phase */}
            {!data && (
                <section className="relative min-h-[870px] flex items-center overflow-hidden w-full -mt-8 pt-8">
                    {/* Background Map Visual (Placeholder) */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10"></div>
                        <img alt="Route Map Background" className="w-full h-full object-cover opacity-30 grayscale saturate-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbsYApA1h4gKR8QZBqdZOkXnWjmLcOtJ5kfNeAlj6KrEHZag7_5m3kUZ_c5i0PHropx2TudvZCOKgL2Ryoa8Sjntk05-Xe92lLNGqbywIDTw-JJxRI_XQ0tqKL0GSeWG_7PmyeHQHhCNOee5uBkmJ4dU8n8rGUTcDm8TcdQF7dHY-slSBc0e8QnnC8SwM0PXHcqi-_i995gpBXnb4bovD2EFlaSRNfTibcCT9BxFblp5FrNSVCOFRirvn3_IAMrL5F7n1O8BdLIFs"/>
                    </div>
                    
                    <div className="relative z-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-4 sm:px-6">
                        {/* Left: Value Proposition */}
                        <div className="lg:col-span-6 space-y-6">
                            <span className="inline-block px-4 py-1.5 bg-secondary-fixed text-on-secondary-fixed-variant font-label-caps rounded-full uppercase tracking-widest text-[10px]">
                                Smart Logistics v4.0
                            </span>
                            <h1 className="font-display-lg text-display-lg text-on-surface leading-tight">
                                Optimize Your Global <br/>
                                <span className="text-secondary">Route Networks</span>
                            </h1>
                            <p className="text-body-md text-on-surface-variant max-w-xl">
                                Logistics Router provides real-time visibility and AI-powered route optimization for the modern logistics professional. Ensure HOS compliance in one click.
                            </p>
                            <div className="flex items-center gap-4 pt-4">
                                <div className="flex -space-x-3">
                                    <img alt="User 1" className="w-10 h-10 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbYRfoAj5g8oK_6EHaI6IAUO1INhEG8Y3QybpGG0hUa915nHjVUH7DH8HmErVkiNVX85rz57bytu9VzW3oLIBPJD8A5oEW_qfGvUfk26cfQU8vHqJHuFK0wopAdVL0sJTJGf_wIB8gbmvkH538lK30jDJZyyov-I-M81j28rLCfTyzqchNlo26Imme-U2dygTv_CoGeuKVqn4LGYXbsnxwOA_lhCTREVIvxy9Mu2FPRe-0OUJ3rjBXfaaJNaJgWLtSBK9OhAjQicw"/>
                                    <img alt="User 2" className="w-10 h-10 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLsKZmxd2JBAG1_TI12oHgZRLh_Ai7qDfDUdDXjg6DFcOy4R2aYeotsVERTnmsDvWszeqFFtLehmliuI1f_DRAZ8LpG43Tmgg8DGEh8X12GmlQ3o-cBIiDvxzwieyvyYH1YgG2NtIKGvo8WdknSrsxfxmvVosilzd1zIdyQzSDwUhkmh_n6C5ORC7Wfw3jgsteCn67kuB_gffM8QyJ4aMHll0q6PM1J0DZ0N7igiejgPtK4kqWWwkob22QiZ2R-xu3tBepUn-EY4g"/>
                                    <img alt="User 3" className="w-10 h-10 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFU6UrLVT2HCepxSyZvtHXaM3TeZ_qT2gYLA_PCL7onGtrR2T78Xa61JnqtyC1AuSz1910zOtTknPh-bbHMKdVnUQWowDvgZ9WAmvuNR95aGNJoVzpkiZ_9X94Axl9B0S7p6j6K-bsNxzg7ZZ-MSefAcLtCIL0bQG6pExD3Lf90MbydSalFdLbD8JQWx6bCREIdX9pbSf93-Xj-fAMYE3gluYLFI1eMsgGq4cEz5luIxOPW8WkIWpXKqYgqN2aMTxd6fBQT9DYpEg"/>
                                </div>
                                <span className="text-body-sm text-on-surface-variant">Trusted by <span className="font-bold text-on-surface">5,000+</span> fleet managers worldwide</span>
                            </div>
                        </div>

                        {/* Right: Route Planning Card */}
                        <div className="lg:col-span-6 flex justify-end animate-in fade-in zoom-in duration-500">
                            <TripInputForm onSubmit={submitTrip} isLoading={isLoading} error={error} />
                        </div>
                    </div>
                </section>
            )}

            {/* Loading State */}
            {isLoading && (
                <LoadingSpinner message="Calculating optimal route and log sheets..." />
            )}

            {/* Results Phase */}
            {data && !isLoading && (
                <div className="animate-in slide-in-from-bottom-8 fade-in duration-700 w-full max-w-7xl mx-auto px-4 sm:px-6">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <nav className="flex items-center gap-2 text-label-caps text-outline mb-2">
                                <span>TRIP CALCULATION</span>
                                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                <span className="text-secondary">ACTIVE ROUTE</span>
                            </nav>
                            <h1 className="font-headline-md text-headline-md text-on-surface">Route & Compliance Overview</h1>
                            <p className="text-body-sm text-on-surface-variant">Validated HOS simulation and optimized path generation.</p>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={resetData}
                                className="px-6 py-2.5 bg-surface-container-highest text-on-surface font-semibold rounded-xl flex items-center gap-2 hover:bg-surface-variant transition-all font-title-sm text-title-sm"
                            >
                                <span className="material-symbols-outlined text-[20px]">add_location</span>
                                Plan Another Trip
                            </button>
                        </div>
                    </div>
                    
                    {user && (
                        <div className="bg-secondary-fixed/20 border border-secondary/20 text-on-secondary-fixed-variant px-4 py-3 rounded-xl mb-8 flex items-center gap-3">
                            <span className="material-symbols-outlined text-secondary">check_circle</span>
                            <span className="font-body-md text-body-md font-medium">Success! This trip has been saved to your Dashboard.</span>
                        </div>
                    )}

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
            )}
        </div>
    );
};

export default Home;
