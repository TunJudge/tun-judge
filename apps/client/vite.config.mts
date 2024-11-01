/// <reference types='vitest' />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/client',

  server: {
    port: 4200,
    host: 'localhost',
    proxy: {
      '^/(api|status|files|images|videos).*': {
        target: 'http://0.0.0.0:3000',
        changeOrigin: true,
        secure: false,
      },
      '^/socket.io': {
        target: `ws://localhost:3000`,
        ws: true,
      },
    },
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  resolve: {
    alias: {
      '@core/components': '/src/core/components',
      '@core/contexts': '/src/core/contexts',
      '@core/constants': '/src/core/constants.ts',
      '@core/hooks': '/src/core/hooks',
      '@core/utils': '/src/core/utils',
      '@core/queries': '/src/core/queries',
    },
  },

  plugins: [svgr(), react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: '../../dist/apps/client',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react/jsx-runtime'],
          'react-server': ['react-dom/server'],
          'react-hook-form': ['react-hook-form'],
          'react-router': ['react-router', 'react-router-dom'],
          'lucide-react': ['lucide-react'],
          'react-query': [
            '@tanstack/query-core',
            '@tanstack/query-devtools',
            '@tanstack/react-query-devtools',
            '@tanstack/react-query',
          ],
          'radix-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
          'zenstack-runtime': ['buffer', 'decimal.js'],
          'tw-react-components': ['tw-react-components'],
        },
      },
    },
  },
});
