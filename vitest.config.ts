import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    fileParallelism: false,
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.test.ts', 'src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts', 'server/**/*.ts'],
      exclude: ['src/index.ts', '**/*.d.ts'],
      thresholds: {
        lines: 15,
        functions: 25,
        branches: 25,
        statements: 15,
      },
      reporter: ['text', 'lcov', 'html'],
    },
  },
})
