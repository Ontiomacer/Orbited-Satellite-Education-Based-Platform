import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5174,
    // Security headers for development
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
    proxy: {
      '/api/workflows': {
        target: 'https://api.worqhat.com',
        changeOrigin: true,
        secure: true, // Enforce HTTPS
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        headers: {
          'User-Agent': 'SatelliteTracker/1.0',
        }
      },
      '/api': {
        target: 'https://api.worqhat.com',
        changeOrigin: true,
        secure: true, // Enforce HTTPS
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          'User-Agent': 'SatelliteTracker/1.0',
        }
      }
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Build security optimizations
  build: {
    sourcemap: mode === 'development', // Only in dev
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production', // Remove console.log in production
        drop_debugger: true,
      },
    },
  },
  // Environment variable validation
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
}));
