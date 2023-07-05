import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    silent: true,
    setupFiles: [
        './test/global-setup.ts'
      ],
  },
})