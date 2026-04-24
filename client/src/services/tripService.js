import axios from 'axios';

// Ensure cookies are sent with every request
axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Axios Interceptor for seamless JWT Token Refresh
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 Unauthorized and we haven't retried yet
        // (and it's not a login or refresh request itself)
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/login') &&
            !originalRequest.url.includes('/auth/token/refresh')
        ) {
            originalRequest._retry = true;
            try {
                // The refresh token is in an HttpOnly cookie, so we just hit the endpoint
                await axios.post(`${API_URL}/auth/token/refresh/`);

                // If successful, the new access token cookie is set!
                // We can now retry the original request
                return axios(originalRequest);
            } catch (refreshError) {
                // If refresh fails (e.g. refresh token expired), they need to log in again.
                // You could trigger a global logout here.
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const calculateTrip = async (tripData) => {
    try {
        const response = await axios.post(`${API_URL}/calculate-trip/`, tripData);
        return response.data;
    } catch (error) {
        console.error("Error calculating trip:", error);
        throw error;
    }
};

export const getTripDetail = async (tripId) => {
    try {
        const response = await axios.get(`${API_URL}/my-trips/${tripId}/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching trip detail:", error);
        throw error;
    }
};
