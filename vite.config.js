import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const dirname = import.meta.dirname

export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['**/*.test.ts', '**/*.test.tsx']
  },
  resolve: {
    alias: {
      '@components': path.resolve(dirname, 'src/components'),
      '@pages': path.resolve(dirname, 'src/pages'),
      '@hooks': path.resolve(dirname, 'src/hooks'),
      '@context': path.resolve(dirname, 'src/context'),
      '@utils': path.resolve(dirname, 'src/utils'),
      '@interfaces': path.resolve(dirname, 'src/types'),
      '@styles': path.resolve(dirname, 'src/styles'),
      '@constants': path.resolve(dirname, 'src/constants'),
      '@routes': path.resolve(dirname, 'src/routes'),
      '@i18n': path.resolve(dirname, 'src/i18n'),
      '@data': path.resolve(dirname, 'src/data'),
      '@layouts': path.resolve(dirname, 'src/layouts')
    }
  }
});
