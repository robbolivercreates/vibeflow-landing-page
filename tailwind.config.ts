import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            animation: {
                "music-bar": "music-bar 1s ease-in-out infinite alternate",
            },
            keyframes: {
                "music-bar": {
                    "0%": { height: "10%" },
                    "100%": { height: "100%" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
