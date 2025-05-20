/* eslint-disable @typescript-eslint/naming-convention */
import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";
import tailwindcss from "@tailwindcss/vite";

/**
 * Vite configuration with focus on proper preview functionality
 * @see https://vitejs.dev/config/
 */
export default defineConfig(({ command }) => {
  const config: UserConfig = {
    plugins: [react(), tailwindcss()],
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
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 1000,
    }
  };

  // Ensure base path is correctly set for preview
  if (command === 'serve') {
    config.base = '/';
  } else {
    config.base = '/grindmode/';
  }
  
  return config;
});