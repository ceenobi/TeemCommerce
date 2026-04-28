import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  async prerender() {
    // const workPaths = WORKS.map(
    //   (work) => `/work/${work.client.split(" ").join("-").toLowerCase()}`,
    // );
    return [
      "/",
      "/account/signin",
      "/account/signup",
      "/account/forgot-password",
      "/account/reset-password",
    ];
  },
  presets: [vercelPreset()],
  future: {
    v8_middleware: true,
  },
} satisfies Config;
