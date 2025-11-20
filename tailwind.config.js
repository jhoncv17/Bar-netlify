module.exports = {
  content: [
    "./pages/*.{html,js}",
    "./index.html",
    "./components/**/*.{html,js}",
    "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Deep forest green
        primary: {
          DEFAULT: "#1B5E20", // green-900
          50: "#E8F5E9", // green-50
          100: "#C8E6C9", // green-100
          200: "#A5D6A7", // green-200
          300: "#81C784", // green-300
          400: "#66BB6A", // green-400
          500: "#4CAF50", // green-500
          600: "#43A047", // green-600
          700: "#388E3C", // green-700
          800: "#2E7D32", // green-800
          900: "#1B5E20", // green-900
        },
        // Secondary Colors - Warm amber
        secondary: {
          DEFAULT: "#FFA000", // amber-600
          50: "#FFF8E1", // amber-50
          100: "#FFECB3", // amber-100
          200: "#FFE082", // amber-200
          300: "#FFD54F", // amber-300
          400: "#FFCA28", // amber-400
          500: "#FFC107", // amber-500
          600: "#FFA000", // amber-600
          700: "#FF8F00", // amber-700
          800: "#FF6F00", // amber-800
          900: "#FF6F00", // amber-900
        },
        // Accent Colors - Vibrant green
        accent: {
          DEFAULT: "#2E7D32", // green-800
          50: "#E8F5E9", // green-50
          100: "#C8E6C9", // green-100
          200: "#A5D6A7", // green-200
          300: "#81C784", // green-300
          400: "#66BB6A", // green-400
          500: "#4CAF50", // green-500
          600: "#43A047", // green-600
          700: "#388E3C", // green-700
          800: "#2E7D32", // green-800
          900: "#1B5E20", // green-900
        },
        // Background Colors
        background: "#FAFAFA", // gray-50
        surface: "#FFFFFF", // white
        // Text Colors
        text: {
          primary: "#212121", // gray-900
          secondary: "#757575", // gray-600
          disabled: "#BDBDBD", // gray-400
        },
        // Status Colors
        success: {
          DEFAULT: "#388E3C", // green-700
          light: "#C8E6C9", // green-100
          dark: "#1B5E20", // green-900
        },
        warning: {
          DEFAULT: "#F57C00", // orange-700
          light: "#FFE0B2", // orange-100
          dark: "#E65100", // orange-900
        },
        error: {
          DEFAULT: "#D32F2F", // red-700
          light: "#FFCDD2", // red-100
          dark: "#B71C1C", // red-900
        },
        info: {
          DEFAULT: "#1976D2", // blue-700
          light: "#BBDEFB", // blue-100
          dark: "#0D47A1", // blue-900
        },
        // Border Colors
        border: {
          DEFAULT: "#E0E0E0", // gray-300
          light: "#F5F5F5", // gray-100
          dark: "#BDBDBD", // gray-400
        },
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Source Sans Pro', 'sans-serif'],
        caption: ['Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'elevated': '0 4px 12px rgba(0, 0, 0, 0.12)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.15)',
        'xl': '0 12px 24px rgba(0, 0, 0, 0.18)',
      },
      borderRadius: {
        'sm': '4px',
        'base': '8px',
        'md': '12px',
        'lg': '16px',
        'full': '9999px',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
    },
  },
  plugins: [],
}