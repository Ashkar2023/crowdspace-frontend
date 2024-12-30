import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

export default {
    content: [
        "./index.html",
        "./src/**/*.{tsx,ts,jsx,js}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Titillium", 'sans-serif']
            },
            colors: {
                "app-primary": "rgb(var(--app-primary) / <alpha-value>)",
                "app-secondary": "rgb(var(--app-secondary) / <alpha-value>)",
                "app-tertiary": "rgb(var(--app-tertiary) / <alpha-value>)",
                "app-t-primary": "rgb(var(--app-text-primary) / <alpha-value>)",
                "app-t-secondary": "rgb(var(--app-text-secondary) / <alpha-value>)",
                "app-accent": "rgb(var(--app-accent) / <alpha-value>)" // this works fine
            },
            keyframes: {
                slideDown: {
                    "0%": { opacity: '0', transform: 'translateY(-10px)' },
                    "100%": { opacity: '1', transform: 'translateY(0)' }
                },
                "slide-in-fl": {
                    "0%": { opacity: '0', transform: 'translateX(-200px)' },
                    "100%": { opacity: '1', transform: 'translateY(0)' }
                },
            },
            animation: {
                slideDown: 'slideDown 0.2s ease-in',
                "slide-in-fl": "slide-in-fl 0.2s ease-in-out",
            },
            screens: {
                "mobile": "480px"
            },
        },
    },
    plugins: [nextui(),],
} satisfies Config;