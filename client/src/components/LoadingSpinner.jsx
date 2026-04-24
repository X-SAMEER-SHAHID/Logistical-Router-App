import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center">
            {/* Animated circular spinner */}
            <div className="relative w-20 h-20 mb-6">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-surface-container-highest"></div>
                {/* Spinning arc */}
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-secondary border-r-secondary animate-spin"></div>
                {/* Inner pulse */}
                <div className="absolute inset-3 rounded-full bg-secondary/10 animate-pulse flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-2xl">route</span>
                </div>
            </div>
            <p className="font-title-sm text-title-sm text-on-surface animate-pulse">{message}</p>
            <div className="flex gap-1.5 mt-3">
                <span className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:0ms]"></span>
                <span className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:150ms]"></span>
                <span className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:300ms]"></span>
            </div>
        </div>
    );
};

export default LoadingSpinner;
