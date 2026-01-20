import vue from '@vitejs/plugin-vue'
import { URL, fileURLToPath } from 'node:url'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3001, // Different port from main app
  },

  plugins: [
    VueRouter({
      routesFolder: 'src/routes',
      extensions: ['.page.vue', '.layout.vue'],
    }),
    vue(),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
