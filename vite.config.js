import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Base path must match the GitHub repo name for GitHub Pages to work
  base: '/smart-ATS/',
})
