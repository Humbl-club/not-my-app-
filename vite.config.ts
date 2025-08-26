import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { securityMiddleware } from "./vite.config.security";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Temporarily disabled for debugging - re-enable after app loads
    // mode === 'development' && securityMiddleware(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Performance optimizations
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Code splitting
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          'i18n': ['i18next', 'react-i18next'],
          'utils': ['date-fns', 'clsx', 'class-variance-authority'],
        },
        // Asset optimization
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').at(-1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType!)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/woff2?|ttf|eot/i.test(extType!)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
    // Performance budgets
    chunkSizeWarningLimit: 500,
    reportCompressedSize: true,
    // Source maps for production debugging (secure environment only)
    sourcemap: mode === 'development',
  },
  optimizeDeps: {
    // Pre-bundle heavy dependencies
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-hook-form',
      'i18next',
      'dompurify'
    ],
  },
  // Security: Prevent exposing sensitive env variables
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
}));