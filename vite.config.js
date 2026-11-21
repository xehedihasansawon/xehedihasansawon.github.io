import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cpSync, existsSync } from 'node:fs'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

const preserveDynamicAssets = {
  name: 'preserve-dynamic-assets',
  closeBundle() {
    const sourceDir = resolve(rootDir, 'assets')
    const outputDir = resolve(rootDir, 'dist/assets')

    if (existsSync(sourceDir)) {
      cpSync(sourceDir, outputDir, { recursive: true, force: true })
    }
  }
}

export default defineConfig({
  base: './',
  plugins: [preserveDynamicAssets],
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        notFound: resolve(rootDir, '404.html'),
        project: resolve(rootDir, 'project.html'),
        ssfc: resolve(rootDir, 'ssfc.html'),
        biporjoy: resolve(rootDir, 'biporjoy.html'),
        miuwErp: resolve(rootDir, 'miuw-erp.html'),
        portfolio: resolve(rootDir, 'portfolio.html')
      }
    }
  }
})
