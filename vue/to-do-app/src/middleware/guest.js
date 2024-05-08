import { useAuthStore } from '@/stores/auth';
import router from '../router';

export default function guest({ next }) {
    const authStore = useAuthStore();
    if (authStore.loggedIn) {
        return router.push({ name: 'home' });
    }
    
    return next();
}