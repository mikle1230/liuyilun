/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  appType: 'spa',

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/react-markdown') || id.includes('node_modules/remark-') || id.includes('node_modules/rehype-')) {
            return 'vendor-md'
          }
        },
      },
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
