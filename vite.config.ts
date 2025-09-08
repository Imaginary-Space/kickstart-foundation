import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Performance optimization: Better chunking strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-slot', '@radix-ui/react-toast', 'lucide-react'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'analytics-vendor': ['posthog-js', '@hotjar/browser'],
          'p5-vendor': ['p5'],
          // Landing page chunk
          'landing': [
            './src/components/Features.tsx',
            './src/components/Testimonials.tsx',
            './src/components/Pricing.tsx',
            './src/components/Footer.tsx'
          ]
        },
      },
    },
    // Enable compression and optimization
    minify: mode === 'production' ? 'esbuild' : false,
    // Enable source maps in development only
    sourcemap: mode === 'development',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
}));
