/* eslint-disable @typescript-eslint/naming-convention */
import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path"
import tailwindcss from "@tailwindcss/vite"


// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config:UserConfig = {
    plugins: [react(), tailwindcss() ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@context': path.resolve(__dirname, './src/context'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@layouts': path.resolve(__dirname, './src/layouts'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@providers': path.resolve(__dirname, './src/providers'),
        '@services': path.resolve(__dirname, './src/services'),
        '@utils': path.resolve(__dirname, './src/utils'),
      },
    },
    // Fixes size issues with Firebase
    build: { 
      rollupOptions: {
        output: {
          manualChunks(id ) {
            if (id.includes('node_modules/@firebase/') || id.includes('node_modules/firebase/')) {
              return 'vendor-firebase';
            }
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules')) {
              return 'vendor'; 
            }
          },
        },
      },
      chunkSizeWarningLimit: 700, 
    },
  };

  // Only add base path for production builds
  if (command !== 'serve') {
    config.base = '/grindmode';
  }
  return config;
});