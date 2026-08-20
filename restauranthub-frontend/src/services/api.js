import axios from "axios";

const api = axios.create({
    baseURL: "https://restauranthub-production-4dfe.up.railway.app/api"
});

api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

export default api;