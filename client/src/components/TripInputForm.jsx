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
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Plan Your Route</h2>
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                    <input 
                        type="text" 
                        name="current_loc"
                        value={formData.current_loc}
                        onChange={handleChange}
                        placeholder="e.g., Los Angeles, CA"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-black"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                    <input 
                        type="text" 
                        name="pickup_loc"
                        value={formData.pickup_loc}
                        onChange={handleChange}
                        placeholder="e.g., Phoenix, AZ"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-black"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Location</label>
                    <input 
                        type="text" 
                        name="dropoff_loc"
                        value={formData.dropoff_loc}
                        onChange={handleChange}
                        placeholder="e.g., Dallas, TX"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-black"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Cycle Used (Hours)</label>
                    <input 
                        type="number" 
                        name="current_cycle_used"
                        value={formData.current_cycle_used}
                        onChange={handleChange}
                        placeholder="e.g., 12.5"
                        min="0"
                        max="70"
                        step="0.1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-black"
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all transform active:scale-95 ${
                        isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                    }`}
                >
                    {isLoading ? 'Calculating...' : 'Calculate Route & Logs'}
                </button>
            </form>
        </div>
    );
};

export default TripInputForm;
