const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");

module.exports = defineConfig({
    plugins: [react()],
    base: "./", // relative asset paths for Nginx
    build: {
        outDir: "dist",
        emptyOutDir: true
    }
});
