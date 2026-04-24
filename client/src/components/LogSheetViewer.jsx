import React, { useState } from 'react';

const LogSheetViewer = ({ logSheets }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!logSheets || logSheets.length === 0) return null;

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === logSheets.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? logSheets.length - 1 : prevIndex - 1
        );
    };

    const currentSheet = logSheets[currentIndex];
    // Need to use absolute URL to backend media server for images
    const imageUrl = `http://localhost:8000${currentSheet.image}`;

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mt-8">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Generated Log Sheets (HOS)</h3>
                <div className="text-sm text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                    Day {currentSheet.day_number} of {logSheets.length}
                </div>
            </div>
            
            <div className="p-6">
                <div className="relative group rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex justify-center items-center p-2 min-h-[300px]">
                    <img 
                        src={imageUrl} 
                        alt={`Log Sheet Day ${currentSheet.day_number}`}
                        className="max-w-full h-auto object-contain cursor-zoom-in hover:scale-105 transition-transform duration-300"
                    />
                    
                    {logSheets.length > 1 && (
                        <>
                            <button 
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button 
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
                
                {logSheets.length > 1 && (
                    <div className="flex justify-center mt-4 space-x-2">
                        {logSheets.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                    idx === currentIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogSheetViewer;
