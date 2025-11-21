import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages サブパス (ユーザー名.github.io/WordTestApp-web/)
  base: '/WordTestApp-web/'
});
