import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export const calculateTrip = async (tripData) => {
    try {
        const response = await axios.post(`${API_URL}/calculate-trip/`, tripData);
        return response.data;
    } catch (error) {
        console.error("Error calculating trip:", error);
        throw error;
    }
};
