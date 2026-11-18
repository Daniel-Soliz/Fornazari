import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  root: 'web',
  base: command === 'build' ? '/Fornazari/' : '/',
  publicDir: '../public',
  resolve: { alias: { '/src': path.resolve('src') } },
  plugins: [react(), tailwindcss()],
  build: { outDir: '../dist', emptyOutDir: true },
  server: { fs: { allow: [path.resolve('.')] }, hmr: process.env.DISABLE_HMR !== 'true' },
}));
