import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            // 排除大文件，避免 Cloudflare Pages 25MB 限制
            assetFileNames: (assetInfo) => {
              // 排除超过 25MB 的文件
              if (assetInfo.name && assetInfo.name.endsWith('.glb')) {
                return 'models/[name][extname]';
              }
              return 'assets/[name]-[hash][extname]';
            }
          }
        },
        // 增加 chunk 大小警告限制
        chunkSizeWarningLimit: 1000
      },
      // 在构建时排除大文件
      publicDir: 'public',
    };
});
