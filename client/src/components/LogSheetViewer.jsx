import React, { useState } from 'react';
import LogSheetSVG from './LogSheetSVG';

const LogSheetViewer = ({ events }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!events || events.length === 0) return null;

    // Get unique days from events
    const days = [...new Set(events.map(e => e.day))].sort((a, b) => a - b);
    
    if (days.length === 0) return null;

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === days.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? days.length - 1 : prevIndex - 1
        );
    };

    const currentDay = days[currentIndex];

    return (
        <div className="w-full">
            <div className="p-4 bg-surface-bright rounded-2xl flex justify-between items-center mb-4">
                <span className="font-title-sm text-title-sm text-on-surface">Daily View</span>
                <div className="text-label-caps font-label-caps text-on-secondary-fixed bg-secondary-fixed px-3 py-1 rounded-full uppercase">
                    Day {currentDay} of {days.length}
                </div>
            </div>
            
            <div className="relative group rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/30 flex justify-center items-center p-4 min-h-[300px]">
                <div className="w-full h-full overflow-x-auto">
                    <LogSheetSVG dayNumber={currentDay} events={events} />
                </div>
                
                {days.length > 1 && (
                    <>
                        <button 
                            onClick={prevSlide}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-surface hover:bg-surface-variant text-on-surface p-2 rounded-full shadow-lg opacity-50 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                        </button>
                        <button 
                            onClick={nextSlide}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-surface hover:bg-surface-variant text-on-surface p-2 rounded-full shadow-lg opacity-50 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </button>
                    </>
                )}
            </div>
            
            {days.length > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                    {days.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                idx === currentIndex ? 'bg-secondary w-6' : 'bg-outline-variant hover:bg-outline'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default LogSheetViewer;
