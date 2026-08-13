import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Deliberately separate from vite.config.ts. Keeping test config out of the
// build config keeps the conflict surface small for branches that touch the
// build (the bachelor-party page adds a rollupOptions.input there).
export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: ['./src/vitest.setup.ts'],
    globals: false,
  },
})
