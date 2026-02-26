import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'inject-env',
        transformIndexHtml(html) {
          return html.replace(
            '</head>',
            `<script>window.process = { env: { GEMINI_API_KEY: "${process.env.GEMINI_API_KEY || ''}" } };</script></head>`
          );
        }
      }
    ],
    define: {
      'process.env.GEMINI_API_KEY': 'window.process.env.GEMINI_API_KEY',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      headers: {
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin",
      },
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
