import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user');
            if (userData) {
                const { access_token } = JSON.parse(userData);
                config.headers.Authorization = `Bearer ${access_token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api; 