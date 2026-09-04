import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // One landing page. A vendor split would cost a second request for no
    // caching benefit, so everything ships in one chunk.
    assetsInlineLimit: 2048,
  },
});
