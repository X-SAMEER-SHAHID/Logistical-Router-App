import React from 'react';
import { useRoutingData } from './hooks/useRoutingData';
import TripInputForm from './components/TripInputForm';
import RouteMap from './components/RouteMap';
import LogSheetViewer from './components/LogSheetViewer';

function App() {
    const { isLoading, error, data, submitTrip, resetData } = useRoutingData();

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-200">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={resetData}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Logistics Router
                        </h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Input Phase */}
                {!data && (
                    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-500">
                        <div className="text-center mb-8 max-w-2xl">
                            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-4">
                                Intelligent Routing & ELD
                            </h2>
                            <p className="text-lg text-gray-600">
                                Enter your trip details below. We'll calculate the optimal route, enforce Hours of Service (HOS) rules, and generate compliant log sheets automatically.
                            </p>
                        </div>
                        <TripInputForm onSubmit={submitTrip} isLoading={isLoading} error={error} />
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                        <p className="text-xl font-medium text-gray-800 animate-pulse">Calculating optimal route and log sheets...</p>
                    </div>
                )}

                {/* Results Phase */}
                {data && !isLoading && (
                    <div className="animate-in slide-in-from-bottom-8 fade-in duration-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Trip Overview</h2>
                            <button 
                                onClick={resetData}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
                            >
                                Plan Another Trip
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <RouteMap data={data} />
                            </div>
                            
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                                    <h3 className="font-bold text-lg border-b pb-2 mb-4">HOS Summary</h3>
                                    <ul className="space-y-3">
                                        <li className="flex justify-between items-center">
                                            <span className="text-gray-600">Total Distance</span>
                                            <span className="font-semibold">{data.total_distance?.toFixed(1)} mi</span>
                                        </li>
                                        <li className="flex justify-between items-center">
                                            <span className="text-gray-600">Total Duration</span>
                                            <span className="font-semibold">{data.total_duration?.toFixed(1)} hrs</span>
                                        </li>
                                        <li className="flex justify-between items-center text-blue-600">
                                            <span>Days Required</span>
                                            <span className="font-bold">{data.log_sheets?.length || 1}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {data.log_sheets && data.log_sheets.length > 0 && (
                            <LogSheetViewer logSheets={data.log_sheets} />
                        )}
                    </div>
                )}

            </main>
        </div>
    );
}

export default App;
