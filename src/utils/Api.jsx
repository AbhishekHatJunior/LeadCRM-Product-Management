import axios from "axios";

const Api = axios.create({
  baseURL: "https://fakestoreapi.com", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request
Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const tempToken = localStorage.getItem("tempToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }else if (tempToken) {
       config.headers["temp_token"] = tempToken;
         
       }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized errors
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized! Redirecting to login.");
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);


export default Api;