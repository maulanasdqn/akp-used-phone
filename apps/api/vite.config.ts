import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/api',
  plugins: [nxViteTsPaths()],
  build: {
    outDir: '../../dist/apps/api',
    emptyOutDir: true,
    target: 'esnext',
    lib: {
      entry: 'src/main.ts',
      formats: ['cjs'],
      fileName: () => 'main.js',
    },
    rollupOptions: {
      external: ['@prisma/client/prisma-client'],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const chunks = id.toString().split('node_modules/')[1].split('/');
            return chunks[0].startsWith('@')
              ? `${chunks[0].slice(1)}__${chunks[1]}`
              : chunks[0];
          }
        },
      },
    },
  },
});
