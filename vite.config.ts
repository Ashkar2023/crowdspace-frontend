import { defineConfig } from 'vite'
import react_swc from "@vitejs/plugin-react-swc"
import path from "node:path";


export default defineConfig({
    plugins: [react_swc()],
    build: {
        outDir: "dist",
    },
    resolve: {
        alias: {
            "~components": path.resolve(__dirname, "./src/components"),
            "~services": path.resolve(__dirname, "./src/services"),
            "~constants": path.resolve(__dirname, "./src/constants"),
            "~hooks": path.resolve(__dirname, "./src/hooks"),
            "~layouts": path.resolve(__dirname, "./src/layouts"),
            "~router": path.resolve(__dirname, "./src/router"),
            "~assets": path.resolve(__dirname, "./src/assets"),
            "~schema": path.resolve(__dirname, "./src/schema"),
            "~types": path.resolve(__dirname, "./src/types"),
            "~utils": path.resolve(__dirname, "./src/utils"),
            "~": path.resolve(__dirname, "./src"),
        }
    }
})