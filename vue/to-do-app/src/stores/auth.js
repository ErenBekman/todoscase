import { defineStore } from "pinia";
import { api } from "@/utils/axios";
import { useStorage, StorageSerializers } from '@vueuse/core'
import router from "@/router";

let loggedIn = false;

export const useAuthStore = defineStore({
  id: "Auth",
  persist: true,
  state: () => ({
    user: useStorage('auth.user', {}, undefined, { serializer: StorageSerializers.object }),
    authToken: useStorage('auth.token', null),
  }),
  getters: {
    loggedIn: (state) => !!state.authToken,
  },
  actions: {
    async login(payload) {
      const result = await api.post("/auth/login", {
        email: payload.email,
        password: payload.password,
      }).catch((e) => { 
        throw e;
      });

      this.authToken = result.data.access_token;
      return this.fetchUser();
    },
    async fetchUser () {
      if (!this.authToken) return;
      try {
          const result = await api.get('/auth/me');
          this.user = result.data;

          if(!loggedIn) {
            loggedIn = true;
          }

          return this.user;
      } catch (e) {
          loggedIn = false
          return null;
      }
    },
    async logout() {
      this.user = {};
      this.authToken = null;
      router.push({ name: 'login' });
    }
  },
});