import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // VoxTheme — Matte Black & Gold
                vox: {
                    bg:        "#0A0A0A",
                    surface:   "#141414",
                    border:    "#1F1F1F",
                    gold:      "#D4AF37",
                    "gold-light": "#E8D48B",
                    "gold-dark":  "#B8960C",
                    text:      "#F5F5F5",
                    muted:     "#8A8A8A",
                    disabled:  "#555555",
                    success:   "#4ADE80",
                    danger:    "#FF4444",
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "vox-gold": "linear-gradient(135deg, #D4AF37, #E8D48B)",
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

