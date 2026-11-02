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
        includeAssets: [
          'brand/torento-logo.png',
          'brand/torento-logo-on-black.png',
          'brand/torento-app-icon-source.jpg',
          'brand/torento-favicon-source.png',
          'brand/icon-192.png',
          'brand/icon-512.png',
          'brand/favicon-32.png',
          'favicon.ico',
          'robots.txt',
          'sitemap.xml',
        ],
        manifestFilename: 'site.webmanifest',
        manifest: {
          name: 'TORENTO — Rent a Car & Bike in Sri Lanka',
          short_name: 'TORENTO',
          description: 'Premium car and bike rentals for exploring Sri Lanka.',
          theme_color: '#1D262D',
          background_color: '#1D262D',
          display: 'standalone',
          start_url: '/',
          lang: 'en-LK',
          icons: [
            {
              src: '/brand/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/brand/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/brand/icon-512.png',
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
              icons: [{ src: '/brand/icon-192.png', sizes: '192x192' }],
            },
            {
              name: 'Contact',
              short_name: 'Contact',
              url: '/contact',
              icons: [{ src: '/brand/icon-192.png', sizes: '192x192' }],
            },
          ],
        },
        workbox: {
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/\.[a-zA-Z0-9]+$/],
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
