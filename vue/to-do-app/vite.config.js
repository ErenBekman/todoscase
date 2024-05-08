// Plugins
import Vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import ViteFonts from 'unplugin-fonts/vite';

// Utilities
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';


// https://vitejs.dev/config/
export default defineConfig(({}) => {
  return {
    publicDir: './public',
    server:{
      port: 3000,
    },
    plugins: [
      Vue({
        template: { transformAssetUrls }
      }),
      Vuetify(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./', import.meta.url)),
      },
      extensions: [
        '.js',
        '.json',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.vue',
      ],
    }
  }
})
