import type { NextConfig } from "next";

/** @type {import("next").NextConfig} */

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "am-lms.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/users/**",

      },
    ],
  },
  serverExternalPackages: ["pdfkit"],
 
};

export default nextConfig;
