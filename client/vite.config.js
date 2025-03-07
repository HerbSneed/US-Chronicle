import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://nwarz-env-1.eba-tb4a7pwf.us-east-1.elasticbeanstalk.com'),
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: "http://nwarz-env-1.eba-tb4a7pwf.us-east-1.elasticbeanstalk.com",
        changeOrigin: true,
        secure: false,
      },
      "/graphql": {
        target: "http://nwarz-env-1.eba-tb4a7pwf.us-east-1.elasticbeanstalk.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

