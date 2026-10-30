/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mib: {
          obsidian: {
            950: '#030406',
            900: '#07090e',
            800: '#0c0f17',
            700: '#131824',
          },
          charcoal: {
            900: '#181b22',
            800: '#212631',
            700: '#2c3342',
            600: '#3c4558',
          },
          silver: {
            100: '#f8fafc',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
          },
          amber: {
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
          },
          cyan: {
            300: '#67e8f9',
            400: '#22d3ee',
            500: '#06b6d4',
            glow: '#00e5ff',
          },
          emerald: {
            400: '#34d399',
            500: '#10b981',
            glow: '#00ff88',
          },
          crimson: {
            500: '#ef4444',
            600: '#dc2626',
            glow: '#ff2a2a',
          }
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      animation: {
        'scanline': 'scanline 4s linear infinite',
        'pulse-subtle': 'pulseGlow 2.5s ease-in-out infinite',
        'radar-sweep': 'radarSweep 3s linear infinite',
        'terminal-blink': 'blink 1s step-start infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'radial-vignette': 'radial-gradient(circle at 50% 30%, rgba(30, 41, 59, 0.25) 0%, rgba(7, 9, 14, 0.95) 75%)',
        'classified-stripe': 'repeating-linear-gradient(45deg, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.05) 10px, transparent 10px, transparent 20px)',
      },
    },
  },
  plugins: [],
};

