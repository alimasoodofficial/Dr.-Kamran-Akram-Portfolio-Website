/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imkamran.com", // 👈 allow your domain
      },
    ],
  },
};

export default nextConfig;
