import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        tree: resolve(__dirname, 'tree.html'),
        comp: resolve(__dirname, 'comp.html'),
        comp_tree: resolve(__dirname, 'comp_tree.html'),
        recommend: resolve(__dirname, 'recommend.html'),
        maintenance: resolve(__dirname, 'maintenance.html'),
        about : resolve(__dirname, 'about.html'),
      },
    },
  },
});
