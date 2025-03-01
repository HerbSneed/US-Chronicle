import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  // Load environment variables


  return {
    plugins: [react()],
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify("https://app-env.eba-2xyk3ern.us-east-1.elasticbeanstalk.com"),
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        "/api": {
          target: "https://app-env.eba-2xyk3ern.us-east-1.elasticbeanstalk.com",
          changeOrigin: true,
          secure: false,
        },
        "/graphql": {
          target: "https://app-env.eba-2xyk3ern.us-east-1.elasticbeanstalk.com",

          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
