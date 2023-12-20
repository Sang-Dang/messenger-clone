import react from '@vitejs/plugin-react-swc'
import path from 'path'
import url from 'url'
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/')
        }
    },
    build: {
        terserOptions: {
            format: {
                comments: false
            }
        },
        rollupOptions: {
            treeshake: true,
            output: {
                manualChunks: {
                    react: ['react'],
                    reactDom: ['react-dom'],
                    reactRouterDom: ['react-router-dom']
                }
            }
            // external: ['react', 'react-dom']
        }
    },
    plugins: [react(), viteCompression()]
})
