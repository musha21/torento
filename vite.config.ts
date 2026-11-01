import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: ['brand/torento-logo.png', 'robots.txt', 'sitemap.xml'],
        manifest: {
          name: 'TORENTO — Rent a Car & Bike in Sri Lanka',
          short_name: 'TORENTO',
          description: 'Premium car and bike rentals for exploring Sri Lanka.',
          theme_color: '#242320',
          background_color: '#ECE3D1',
          display: 'standalone',
          start_url: '/',
          lang: 'en-LK',
          icons: [
            {
              src: '/brand/torento-logo.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/brand/torento-logo.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          shortcuts: [
            {
              name: 'Browse vehicles',
              short_name: 'Fleet',
              url: '/vehicles',
              icons: [{ src: '/brand/torento-logo.png', sizes: '512x512' }],
            },
            {
              name: 'Contact',
              short_name: 'Contact',
              url: '/contact',
              icons: [{ src: '/brand/torento-logo.png', sizes: '512x512' }],
            },
          ],
        },
        workbox: {
          navigateFallback: '/index.html',
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,jpg,jpeg,webp}'],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
      dedupe: ['react', 'react-dom'],
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
