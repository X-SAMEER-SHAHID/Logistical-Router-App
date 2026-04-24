import React, { useState } from 'react';

const TripInputForm = ({ onSubmit, isLoading, error }) => {
    const [formData, setFormData] = useState({
        current_loc: '',
        pickup_loc: '',
        dropoff_loc: '',
        current_cycle_used: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="glass-card w-full max-w-md rounded-xl p-card-padding shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline-md text-headline-md text-on-surface">Plan Your Route</h2>
                <div className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter">Live</div>
            </div>
            
            {error && (
                <div className="bg-error-container text-error p-3 rounded-lg mb-6 text-sm text-center font-body-sm">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Input: Current Location */}
                <div className="space-y-1">
                    <label className="font-label-caps text-label-caps text-on-surface-variant ml-1">Current Location</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg">my_location</span>
                        <input 
                            type="text" 
                            name="current_loc"
                            value={formData.current_loc}
                            onChange={handleChange}
                            placeholder="e.g., Los Angeles, CA"
                            className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary-container focus:border-secondary outline-none transition-all text-body-md text-on-surface"
                            required
                        />
                    </div>
                </div>

                {/* Connectivity Line */}
                <div className="relative px-5 py-1">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-outline-variant"></div>
                </div>

                {/* Input: Pickup */}
                <div className="space-y-1">
                    <label className="font-label-caps text-label-caps text-on-surface-variant ml-1">Pickup Point</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-tertiary-fixed-dim text-lg">location_on</span>
                        <input 
                            type="text" 
                            name="pickup_loc"
                            value={formData.pickup_loc}
                            onChange={handleChange}
                            placeholder="e.g., Phoenix, AZ"
                            className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary-container focus:border-secondary outline-none transition-all text-body-md text-on-surface"
                            required
                        />
                    </div>
                </div>

                {/* Connectivity Line */}
                <div className="relative px-5 py-1">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-outline-variant"></div>
                </div>

                {/* Input: Dropoff */}
                <div className="space-y-1">
                    <label className="font-label-caps text-label-caps text-on-surface-variant ml-1">Dropoff Destination</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-error text-lg">flag</span>
                        <input 
                            type="text" 
                            name="dropoff_loc"
                            value={formData.dropoff_loc}
                            onChange={handleChange}
                            placeholder="e.g., Dallas, TX"
                            className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary-container focus:border-secondary outline-none transition-all text-body-md text-on-surface"
                            required
                        />
                    </div>
                </div>

                {/* Additional Settings Group */}
                <div className="pt-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant ml-1">Hours of Service constraint</label>
                    <div className="flex gap-2 mt-1">
                        <div className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 flex items-center justify-between w-full">
                            <span className="text-body-sm font-body-sm text-on-surface-variant">Cycle Hours Used</span>
                            <input 
                                type="number" 
                                name="current_cycle_used"
                                value={formData.current_cycle_used}
                                onChange={handleChange}
                                placeholder="0.0"
                                min="0"
                                max="70"
                                step="0.1"
                                className="w-16 text-right bg-transparent outline-none font-title-sm text-title-sm text-on-surface"
                                required
                            />
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full mt-4 py-4 rounded-lg text-white font-title-sm text-title-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                        isLoading 
                        ? 'bg-outline cursor-not-allowed' 
                        : 'bg-gradient-to-r from-secondary to-on-secondary-fixed-variant hover:scale-[1.02] active:scale-95 shadow-lg shadow-secondary/20 hover:shadow-xl'
                    }`}
                >
                    {isLoading ? (
                        <>
                            <span className="material-symbols-outlined animate-spin text-lg">refresh</span>
                            Calculating...
                        </>
                    ) : (
                        <>
                            Generate Optimal Route
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default TripInputForm;
