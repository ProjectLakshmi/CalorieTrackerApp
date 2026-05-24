import axios from "axios";

const AxiosInstance = axios.create({
    baseURL: "https://localhost:7213/api",
});

// Attach token to every request automatically
AxiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default AxiosInstance;