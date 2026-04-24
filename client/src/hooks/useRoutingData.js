import { useState } from 'react';
import { calculateTrip } from '../services/tripService';

export const useRoutingData = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const submitTrip = async (tripData) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await calculateTrip(tripData);
            setData(result);
        } catch (err) {
            setError(err.response?.data?.error || err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const resetData = () => {
        setData(null);
        setError(null);
    };

    return { isLoading, error, data, submitTrip, resetData };
};
