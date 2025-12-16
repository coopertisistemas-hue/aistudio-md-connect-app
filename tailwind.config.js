/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1e3a8a', // Deep Blue (Trust)
                    foreground: '#ffffff',
                },
                secondary: {
                    DEFAULT: '#10b981', // Soft Green (Hope)
                    foreground: '#ffffff',
                },
                highlight: {
                    DEFAULT: '#f59e0b', // Amber (Emphasis)
                    foreground: '#ffffff',
                },
                alert: {
                    DEFAULT: '#ef4444', // Red (Alert)
                    foreground: '#ffffff',
                },
                background: '#f8fafc', // Slate 50 (Clean)
                foreground: '#0f172a', // Slate 900 (Text)
                muted: '#64748b', // Slate 500
                border: '#e2e8f0', // Slate 200
                input: '#e2e8f0', // Slate 200
                ring: '#1e3a8a', // Primary Blue
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Montserrat', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
