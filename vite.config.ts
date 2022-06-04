import { resolve } from 'path';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

import react from '@vitejs/plugin-react';

const root: string = resolve(__dirname, 'src');
const outDir: string = resolve(__dirname, 'dist');

// https://vitejs.dev/config/
export default defineConfig({
  root,
  base: '/weather-app/',
  resolve: {
    alias: [
      { find: '@/Components', replacement: resolve(__dirname, 'src/components') },
      { find: '@/SCSS', replacement: resolve(__dirname, 'src/scss') },
    ],
  },
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true,
    })
  ],
  build: {
    outDir,
    assetsInlineLimit: 0,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'js/main.js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: ({ name = '' }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name)){
            return 'img/[name].[ext]';
          }
          if (/\.css$/.test(name)) {
            return 'css/[name].[ext]';
          }
          if (/manifest\.json$/.test(name)) {
            return '[name].[ext]';
          }
          return '[name].[ext]';
        }
      }
    },
  }
});