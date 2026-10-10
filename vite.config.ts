import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1_100,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.name?.endsWith('.glb')
            ? 'models/[name][extname]'
            : 'assets/[name]-[hash][extname]',
        manualChunks: (id) => {
          if (id.includes('/node_modules/@react-three/') || id.includes('/node_modules/three')) {
            return 'three-runtime';
          }
          if (id.includes('/node_modules/react')) return 'react-runtime';
          return undefined;
        },
      },
    },
  },
  publicDir: 'public',
});
