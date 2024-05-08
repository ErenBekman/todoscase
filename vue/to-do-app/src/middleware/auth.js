import { useAuthStore } from '@/stores/auth';
import router from '../router';

export default function auth({ next }) {
    const authStore = useAuthStore();
    if (!authStore.loggedIn) {
      return router.push({ name: 'login' });
    }
  
    return next();
}