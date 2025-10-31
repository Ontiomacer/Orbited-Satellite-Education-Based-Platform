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
  // Build optimizations
  build: {
    sourcemap: mode === 'development', // Only in dev
    minify: mode === 'production' ? 'terser' : 'esbuild',
    terserOptions: mode === 'production' ? {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
      mangle: {
        safari10: true,
      },
    } : undefined,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
    target: 'esnext',
    chunkSizeWarningLimit: 1000,
  },
  // Environment variable validation
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
}));
