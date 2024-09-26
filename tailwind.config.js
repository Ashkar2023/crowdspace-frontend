import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{jsx,js}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        fontFamily:{
            "sans":["Titillium",'sans-serif']
        },
        keyframes:{
            slideDown:{
                "0%":{opacity:'0',transform:'translateY(-10px)'},
                "100%":{opacity:'1',transform:'translateY(0)'}
            }
        },
        animation:{
            slideDown:'slideDown 0.2s ease-in',
        }
    },
  },
  plugins: [nextui(),],
}