import path from 'path';
import { defineConfig } from 'vite'; // 'loadEnv' را هم حذف کنید چون دیگر لازم نیست
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // const env = loadEnv(mode, '.', ''); // <-- این خط را حذف کنید
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      // --- این بخش 'define' کاملاً حذف شود ---
      // define: {
      //   'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      //   'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      // },
      // -------------------------------------
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});