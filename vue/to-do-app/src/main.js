import { createApp, markRaw } from 'vue';
import App from './App.vue';
import router from "./router";
import "./assets/main.scss";
import { registerPlugins } from '@/plugins';
import { createPinia } from "pinia";


const app = createApp(App);
const pinia = createPinia();
pinia.use(() => ({ }));
pinia.use(({ store }) => {
  store.$router = markRaw(router);
});
registerPlugins(app);
app.use(pinia);
app.use(router);
app.mount("#app");

