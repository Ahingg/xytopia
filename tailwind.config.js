/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                growtopia: {
                    blue: "#4a9eff",
                    "dark-blue": "#2a5aa0",
                    green: "#4CAF50",
                    brown: "#8D6E63",
                    dirt: "#654321",
                    sky: "#87CEEB",
                },
                portfolio: {
                    dark: "#1a1a2e",
                    darker: "#16213e",
                    accent: "#0f4c75",
                    light: "#3282b8",
                },
            },
            fontFamily: {
                growtopia: ["Press Start 2P", "monospace"],
                modern: ["Inter", "system-ui", "sans-serif"],
            },
            animation: {
                float: "float 3s ease-in-out infinite",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "bounce-soft": "bounce 2s infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
        },
    },
    plugins: [],
};
