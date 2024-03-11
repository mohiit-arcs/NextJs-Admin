import { getAuthToken } from "@/services/frontend/storage.service";
import axios from "axios";

const axiosFetch = axios.create();
axiosFetch.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosFetch;
