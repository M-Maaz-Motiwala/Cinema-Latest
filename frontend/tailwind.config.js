// tailwind.config.js

const colors = require('tailwindcss/colors');

module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // Include your source files
    ],
    theme: {
        extend: {
            colors: {
                background: "#1f2937", // Dark background(main)(1f2937)
                primary: "#e5e7eb",   // Light text color
                secondary: "#374151", // Secondary panel color
                highlight: "#f59e0b", // Highlight color (Amber-like)
                accent: "#d97706",   // Accent color (Deeper amber/orange)#d97706
                expandedContainer: "#acbbd0",
            },
            fontFamily: {
                display: ["Poppins", "sans-serif"], // For headings
                body: ["Playfair Display", "serif"],    // For body text
            },
            borderRadius: {
                lg: "12px",
                xl: "20px",
            },
            borderWidth: {
                DEFAULT: "1px",
                2: "2px", // For dashed borders
            },
            spacing: {
                128: "32rem",
                144: "36rem",
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.5s ease-in-out',
            },
        },
    },
    plugins: [
        require('tailwind-scrollbar'),
    ],
};
