import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";
import router from "@/router";

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.authToken) {
    config.headers.Authorization = 'Bearer ' + authStore.authToken;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const authStore = useAuthStore();
    if (response.headers.authorization) {
      authStore.authToken = response.headers.authorization;
    }
    return response;
  },
  (error) => {
    const authStore = useAuthStore();
    if (error.response?.status === 401) {
      authStore.user = {};
      authStore.authToken = null;

      const route = useRoute();
      if (!error.config?.noRedirect && route?.meta?.middleware?.includes('auth')) {
        router.push({ name: 'login' });
      }
    }
    return Promise.reject(error);
  }
);

export { api };
